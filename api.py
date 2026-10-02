"""MaatriSakhi Pregnancy Companion API - FastAPI backend

Doctor-centric: doctors sign in, create patients, and see only their own patients.
All patient-data endpoints require a valid JWT token.

Connects to PostgreSQL via DATABASE_URL environment variable.
Reuses jsonschema validation. Does not modify generator.py behavior.

Endpoints:
  GET  /health                  - Health check
  POST /auth/login              - Doctor login (backend auth, hashed passwords, JWT)
  POST /patients                - Create a new patient (requires JWT, consent checkbox)
  GET  /patients/my             - Get current doctor's patients
  GET  /patients/{patient_id}   - Get specific patient (doctor-only)
  POST /consent                 - Record patient consent
"""
from dotenv import load_dotenv
load_dotenv(override=True)
import os
import json
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
import asyncpg
from jsonschema import validate, Draft202012Validator, ValidationError
import jwt

from database_init import initialize_database  # ADD THIS

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set; app refusing to start without it")

# SECRET_KEY is required - no hardcoded default
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable not set; app refusing to start without it")

# CORS allow-list: exact origins read from env; default to localhost for dev
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

# DATABASE_URL may be a Supabase Session pooler URL; ensure sslmode=require is set
if DATABASE_URL and "sslmode" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL + ("&" if "?" in DATABASE_URL else "?") + "sslmode=require"

# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class DoctorLogin(BaseModel):
    email: str = Field(..., description="Doctor's email")
    password: str = Field(..., description="Plain password (verified server-side)")


class DoctorSignup(BaseModel):
    email: EmailStr = Field(..., description="Doctor's email")
    password: str = Field(..., min_length=6, description="Plain password (hashed server-side)")


class PatientCreate(BaseModel):
    name: str = Field(..., min_length=1, description="Patient's full name")
    phone: Optional[str] = Field(default=None, description="Phone number with country code")
    language: str = Field(default="en", description="Preferred language code")
    consentGiven: bool = Field(
        default=False, description="Patient has given informed consent"
    )
    doctorDescription: Optional[str] = Field(
        default=None, description="Doctor's initial notes"
    )


class PatientUpdate(BaseModel):
    name: Optional[str] = Field(default=None, description="Patient's full name")
    phone: Optional[str] = Field(default=None, description="Phone number")
    language: Optional[str] = Field(default=None, description="Preferred language")
    consentGiven: Optional[bool] = Field(
        default=None, description="Updated consent status"
    )
    doctorDescription: Optional[str] = Field(
        default=None, description="Updated doctor notes"
    )


class ConsentRecord(BaseModel):
    consentGiven: bool = Field(..., description="Whether consent was given")
    consentAt: Optional[str] = Field(
        default=None, description="Timestamp when consent was given"
    )
    note: Optional[str] = Field(default=None, description="Clinician note about consent")


# ---------------------------------------------------------------------------
# JSON Schemas (embedded, matching the original design)
# ---------------------------------------------------------------------------

DOCTOR_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["id", "email", "name", "password_hash"],
    "properties": {
        "id": {"type": "string", "format": "uuid"},
        "email": {"type": "string", "format": "email"},
        "name": {"type": "string", "minLength": 1},
        "password_hash": {"type": "string"},
    },
}

PATIENT_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["id", "doctor_id", "name", "consent_given", "consent_at"],
    "properties": {
        "id": {"type": "string", "format": "uuid"},
        "doctor_id": {"type": "string", "format": "uuid"},
        "name": {"type": "string", "minLength": 1},
        "phone": {"type": ["string", "null"]},
        "language": {
            "type": "string",
            "enum": ["en", "hi", "te", "ta", "kn", "ml", "bn", "mr"],
        },
        "consent_given": {"type": "boolean"},
        "consent_at": {"type": ["string", "null"], "format": "date-time"},
        "doctor_description": {"type": ["string", "null"]},
        "status": {"type": "string", "default": "Active"},
    },
}

PREGNANCY_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["id", "mother_id"],
    "properties": {
        "id": {"type": "string", "format": "uuid"},
        "mother_id": {"type": "string", "format": "uuid"},
        "current_week": {"type": ["integer", "null"]},
        "next_visit_date": {"type": ["string", "null"], "format": "date"},
        "has_high_bp": {"type": ["boolean", "null"]},
        "has_gestational_diabetes": {"type": ["boolean", "null"]},
        "bp_limit_systolic": {"type": ["integer", "null"]},
        "bp_limit_diastolic": {"type": ["integer", "null"]},
        "sugar_limit_fasting": {"type": ["integer", "null"]},
        "sugar_limit_post_meal": {"type": ["integer", "null"]},
        "doctor_access_granted": {"type": "boolean", "default": False},
        "created_at": {"type": "string", "format": "date-time"},
        "updated_at": {"type": "string", "format": "date-time"},
    },
}

ENTRY_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["id", "pregnancy_id", "type", "value_json"],
    "properties": {
        "id": {"type": "string", "format": "uuid"},
        "pregnancy_id": {"type": "string", "format": "uuid"},
        "type": {
            "type": "string",
            "enum": ["bp", "sugar", "symptom", "report"],
        },
        "value_json": {"type": "object"},
        "note": {"type": ["string", "null"]},
        "file_path": {"type": ["string", "null"]},
        "created_at": {"type": "string", "format": "date-time"},
    },
}

DOCTOR_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["id", "email", "name", "password_hash"],
    "properties": {
        "id": {"type": "string", "format": "uuid"},
        "email": {"type": "string", "format": "email"},
        "name": {"type": "string", "minLength": 1},
        "password_hash": {"type": "string"},
    },
}

PATIENT_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["id", "doctor_id", "name", "consent_given", "consent_at"],
    "properties": {
        "id": {"type": "string", "format": "uuid"},
        "doctor_id": {"type": "string", "format": "uuid"},
        "name": {"type": "string", "minLength": 1},
        "phone": {"type": ["string", "null"]},
        "language": {
            "type": "string",
            "enum": ["en", "hi", "te", "ta", "kn", "ml", "bn", "mr"],
        },
        "consent_given": {"type": "boolean"},
        "consent_at": {"type": ["string", "null"], "format": "date-time"},
        "doctor_description": {"type": ["string", "null"]},
        "status": {"type": "string", "default": "Active"},
    },
}

VISIT_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["id", "pregnancy_id", "visit_date"],
    "properties": {
        "id": {"type": "string", "format": "uuid"},
        "pregnancy_id": {"type": "string", "format": "uuid"},
        "visit_date": {"type": "string", "format": "date"},
        "summary_text": {"type": ["string", "null"]},
        "docx_path": {"type": ["string", "null"]},
        "created_at": {"type": "string", "format": "date-time"},
    },
}

# Create validators
doctor_validator = Draft202012Validator(DOCTOR_SCHEMA)
patient_validator = Draft202012Validator(PATIENT_SCHEMA)
pregnancy_validator = Draft202012Validator(PREGNANCY_SCHEMA)
entry_validator = Draft202012Validator(ENTRY_SCHEMA)
visit_validator = Draft202012Validator(VISIT_SCHEMA)


def validate_model(data: dict, validator: Draft202012Validator) -> list:
    """Validate data against a JSON schema validator. Returns list of error strings."""
    errors = []
    for error in validator.iter_errors(data):
        path = ".".join(map(str, error.absolute_path)) or "root"
        errors.append(f"{path}: {error.message}")
    return errors


# ---------------------------------------------------------------------------
# FastAPI app setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="MaatriSakhi Pregnancy Companion API",
    description="Doctor-centric API for pregnancy data collection",
    version="1.0.0",
)

# CORS configuration - exact origin allow-list from ALLOWED_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# ---------------------------------------------------------------------------
# Database dependency
# ---------------------------------------------------------------------------


@app.on_event("startup")
async def startup():
    """Create database connection pool on startup."""
    app.db = await asyncpg.create_pool(
        DATABASE_URL,
        min_size=2,
        max_size=10,
        command_timeout=60,
    )


@app.on_event("shutdown")
async def shutdown():
    """Close database connection pool on shutdown."""
    if hasattr(app, "db"):
        await app.db.close()


# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------


def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    import bcrypt
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    """Verify password against bcrypt hash."""
    import bcrypt
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


# ---------------------------------------------------------------------------
# Helper: create JWT token
# ---------------------------------------------------------------------------


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token."""
    import jwt
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt


# ---------------------------------------------------------------------------
# Dependency: get DB connection from pool
# ---------------------------------------------------------------------------


async def get_db():
    """Yield a DB connection from the pool."""
    pool = getattr(app, "db", None)
    if pool is None:
        raise HTTPException(
            status_code=503, detail="Database not initialised"
        )
    async with pool.acquire() as connection:
        yield connection


# ---------------------------------------------------------------------------
# Dependency: get current doctor from JWT
# ---------------------------------------------------------------------------


async def get_current_doctor(
    token: str = Depends(oauth2_scheme),
    connection=Depends(get_db),
):
    """Extract doctor ID from JWT and verify it's valid."""
    try:
        payload = jwt.decode(
            token, SECRET_KEY, algorithms=["HS256"]
        )
        doctor_id: str = payload.get("sub")
        if doctor_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    # Look up doctor
    row = await connection.fetchrow(
        "SELECT id, email, name FROM doctors WHERE id = $1::uuid", doctor_id
    )
    if row is None:
        raise HTTPException(status_code=401, detail="Doctor not found")
    
    return {"id": str(row["id"]), "email": row["email"], "name": row["name"]}


# ---------------------------------------------------------------------------
# On-event: create tables + doctor table on startup
# ---------------------------------------------------------------------------

@app.on_event("startup")
async def startup():
    """Create database tables and doctor table on startup."""
    await initialize_database()
    
    # Create database pool
    app.db = await asyncpg.create_pool(
        DATABASE_URL,
        min_size=2,
        max_size=10,
        command_timeout=60,
    )


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/health", include_in_schema=False)
async def health():
    """Health check endpoint."""
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.post("/auth/login")
async def login(
    payload: DoctorLogin,
    connection=Depends(get_db),
):
    """Doctor login. Backend auth with hashed passwords and JWT."""
    row = await connection.fetchrow(
        "SELECT id, email, name, password_hash FROM doctors WHERE email = $1",
        payload.email,
    )
    if not row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    if not verify_password(payload.password, row["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    # Create JWT token
    access_token = create_access_token(
        data={"sub": str(row["id"]), "email": row["email"], "name": row["name"]}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "doctor": {"id": str(row["id"]), "name": row["name"], "email": row["email"]},
    }


@app.post("/api/auth/login")
async def api_login(
    payload: DoctorLogin,
    connection=Depends(get_db),
):
    """API version of doctor login with /api prefix."""
    return await login(payload, connection)


@app.get("/api/auth/me")
async def api_me(
    current_doctor=Depends(get_current_doctor),
):
    """Get current logged-in doctor with Bearer token."""
    return current_doctor


@app.post("/auth/signup")
async def signup(
    payload: DoctorSignup,
    connection=Depends(get_db),
):
    """Doctor sign-up. Creates account with hashed password."""
    # Check if doctor already exists
    existing = await connection.fetchrow("SELECT id FROM doctors WHERE email = $1", payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Doctor with this email already exists",
        )
    
    # Create doctor with hashed password
    doctor_id = str(uuid.uuid4())
    hashed_pw = hash_password(payload.password)
    now = datetime.now(timezone.utc).isoformat()
    
    await connection.execute(
        """INSERT INTO doctors
           (id, email, name, password_hash, created_at)
           VALUES ($1::uuid, $2, $3, $4, $5)""",
        doctor_id,
        payload.email,
        payload.email.split("@")[0].title(),  # use name from email
        hashed_pw,
        now,
    )
    
    # Create JWT token
    access_token = create_access_token(data={"sub": doctor_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "doctor": {"id": doctor_id, "name": payload.email.split("@")[0].title(), "email": payload.email},
    }


# ---------------------------------------------------------------------------
# Patient endpoints
# ---------------------------------------------------------------------------

@app.post("/patients")
async def create_patient(
    payload: PatientCreate,
    current_doctor=Depends(get_current_doctor),
    connection=Depends(get_db),
):
    """Create a new patient for the authenticated doctor.
    
    Requires valid JWT. Patient consent is required (consent_given must be True).
    Returns 422 if consent_given is not True.
    """
    if not payload.consentGiven:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Patient consent must be given before creating a patient record.",
        )
    
    patient_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    # Insert patient with consent flag
    await connection.execute(
        """INSERT INTO patients
           (id, doctor_id, name, phone, language, consent_given, consent_at, doctor_description, created_at)
           VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, $8, $9)""",
        patient_id,
        current_doctor["id"],
        payload.name,
        payload.phone,
        payload.language,
        payload.consentGiven,
        datetime.now(timezone.utc).isoformat() if payload.consentGiven else None,
        payload.doctorDescription,
    )
    
    # Also create default pregnancy record
    await connection.execute(
        """INSERT INTO pregnancies (id, mother_id, current_week, next_visit_date,
             has_high_bp, has_gestational_diabetes, bp_limit_systolic, bp_limit_diastolic,
             sugar_limit_fasting, sugar_limit_post_meal, doctor_access_granted, created_at, updated_at)
           VALUES ($1::uuid, $2::uuid, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)""",
        patient_id,  # patient_id as mother_id for simplicity, or we could use a separate structure
        current_doctor["id"],
    )
    
    return {
        "id": patient_id,
        "name": payload.name,
        "doctor_id": current_doctor["id"],
        "consent_given": payload.consentGiven,
        "message": "Patient created. Consent recorded." if payload.consentGiven else "Patient created. Consent pending.",
    }


@app.get("/patients/my")
async def get_my_patients(
    current_doctor=Depends(get_current_doctor),
    connection=Depends(get_db),
):
    """Get all patients for the authenticated doctor."""
    rows = await connection.fetch(
        """SELECT id, name, phone, language, consent_given, consent_at, 
          created_at, doctor_description, status
          FROM patients WHERE doctor_id = $1::uuid ORDER BY created_at DESC""",
        current_doctor["id"],
    )
    return [dict(row) for row in rows]


@app.get("/patients/{patient_id}")
async def get_patient(
    patient_id: str,
    current_doctor=Depends(get_current_doctor),
    connection=Depends(get_db),
):
    """Get a specific patient (doctor-only)."""
    # Verify patient belongs to this doctor
    patient = await connection.fetchrow(
        """SELECT id, name, phone, language, consent_given, consent_at, 
          created_at, doctor_description, status
          FROM patients WHERE id = $1::uuid AND doctor_id = $2::uuid""",
        patient_id,
        current_doctor["id"],
    )
    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found or not yours"
        )
    return dict(patient)


# ---------------------------------------------------------------------------
# Consent endpoint
# ---------------------------------------------------------------------------

@app.post("/consent")
async def record_consent(
    payload: ConsentRecord,
    current_doctor=Depends(get_current_doctor),
    connection=Depends(get_db),
):
    """Record or update patient consent."""
    # Find the patient - we need to identify which patient
    # For simplicity, we'll update the most recent patient for this doctor
    # In production, would need patient_id
    await connection.execute(
        """UPDATE patients
           SET consent_given = $1, consent_at = $2, updated_at = CURRENT_TIMESTAMP
           WHERE doctor_id = $3::uuid
           ORDER BY created_at DESC LIMIT 1""",
        payload.consentGiven,
        datetime.now(timezone.utc).isoformat() if payload.consentGiven else None,
    )
    
    return {
        "consent_given": payload.consentGiven,
        "consent_at": datetime.now(timezone.utc).isoformat() if payload.consentGiven else None,
        "message": "Consent recorded" if payload.consentGiven else "Consent revoked",
    }


# ---------------------------------------------------------------------------
# Mother auth + Pregnancy / Entry / Visit (new "I'm pregnant" flow)
# Tables: Mother -> Pregnancy -> Entry, Visit (FK chain, see db/schema.sql)
# Frontend: React MotherAuth / ConsentScreen / PregnancySetupFlow
# ---------------------------------------------------------------------------

class MotherSignup(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=6)
    language: str = Field(default="en")


class MotherLogin(BaseModel):
    email: str = Field(...)
    password: str = Field(...)


class MotherConsent(BaseModel):
    consent_given: bool = Field(...)


class PregnancyUpsert(BaseModel):
    current_week: Optional[int] = Field(default=None, ge=1, le=42)
    next_visit_date: Optional[str] = Field(default=None)
    has_high_bp: Optional[bool] = Field(default=None)
    has_gestational_diabetes: Optional[bool] = Field(default=None)
    bp_limit_systolic: Optional[int] = Field(default=None, ge=50, le=250)
    bp_limit_diastolic: Optional[int] = Field(default=None, ge=30, le=150)
    sugar_limit_fasting: Optional[int] = Field(default=None, ge=40, le=400)
    sugar_limit_post_meal: Optional[int] = Field(default=None, ge=40, le=600)


class EntryCreate(BaseModel):
    pregnancy_id: str = Field(...)
    type: str = Field(..., pattern="^(bp|sugar|symptom|report)$")
    value_json: dict = Field(...)
    note: Optional[str] = Field(default=None)


class VisitCreate(BaseModel):
    pregnancy_id: str = Field(...)
    visit_date: str = Field(...)
    summary_text: Optional[str] = Field(default=None)


def _mother_token(mother_id: str, email: str):
    return create_access_token(data={"sub": mother_id, "email": email, "role": "mother"})


async def get_current_mother(token: str = Depends(oauth2_scheme), connection=Depends(get_db)):
    """Mother JWT (role=mother). Rejects doctor tokens."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        if payload.get("role") != "mother":
            raise HTTPException(status_code=401, detail="Mother login required")
        mother_id: str = payload.get("sub")
        if not mother_id:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    row = await connection.fetchrow(
        "SELECT id, name, email, language, consent_given, consent_at FROM mothers WHERE id = $1::uuid",
        mother_id,
    )
    if row is None:
        raise HTTPException(status_code=401, detail="Mother not found")
    return {
        "id": str(row["id"]), "name": row["name"], "email": row["email"],
        "language": row["language"], "consent_given": row["consent_given"],
        "consent_at": row["consent_at"].isoformat() if row["consent_at"] else None,
    }


async def _mother_owns_pregnancy(connection, mother_id: str, pregnancy_id: str):
    row = await connection.fetchrow(
        "SELECT id FROM pregnancies WHERE id = $1::uuid AND mother_id = $2::uuid",
        pregnancy_id, mother_id,
    )
    return row is not None


@app.post("/mothers/signup")
async def mother_signup(payload: MotherSignup, connection=Depends(get_db)):
    """Mother sign-up. Consent is FALSE until ConsentScreen is accepted."""
    existing = await connection.fetchrow("SELECT id FROM mothers WHERE email = $1", payload.email)
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    mother_id = str(uuid.uuid4())
    await connection.execute(
        """INSERT INTO mothers (id, name, email, password_hash, language, consent_given)
           VALUES ($1::uuid, $2, $3, $4, $5, FALSE)""",
        mother_id, payload.name, payload.email, hash_password(payload.password), payload.language,
    )
    return {
        "access_token": _mother_token(mother_id, payload.email),
        "token_type": "bearer",
        "mother": {"id": mother_id, "name": payload.name, "email": payload.email,
                   "consent_given": False, "consent_at": None},
    }


@app.post("/mothers/login")
async def mother_login(payload: MotherLogin, connection=Depends(get_db)):
    row = await connection.fetchrow(
        "SELECT id, name, email, password_hash, language, consent_given, consent_at "
        "FROM mothers WHERE email = $1", payload.email,
    )
    if not row or not verify_password(payload.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "access_token": _mother_token(str(row["id"]), row["email"]),
        "token_type": "bearer",
        "mother": {"id": str(row["id"]), "name": row["name"], "email": row["email"],
                   "language": row["language"], "consent_given": row["consent_given"],
                   "consent_at": row["consent_at"].isoformat() if row["consent_at"] else None},
    }


@app.get("/mothers/me")
async def mother_me(current_mother=Depends(get_current_mother)):
    return current_mother


@app.post("/mothers/consent")
async def mother_consent(payload: MotherConsent, current_mother=Depends(get_current_mother),
                         connection=Depends(get_db)):
    """Save consent_given (bool) + consent_date (timestamp). Shown BEFORE any health data."""
    now = datetime.now(timezone.utc) if payload.consent_given else None
    await connection.execute(
        "UPDATE mothers SET consent_given = $1, consent_at = $2, updated_at = NOW() WHERE id = $3::uuid",
        payload.consent_given, now, current_mother["id"],
    )
    return {"consent_given": payload.consent_given,
            "consent_at": now.isoformat() if now else None,
            "message": "Consent recorded — you can revoke access at any time." if payload.consent_given
                       else "Consent revoked — health tracking is paused."}


@app.post("/pregnancies")
async def create_pregnancy(payload: PregnancyUpsert, current_mother=Depends(get_current_mother),
                           connection=Depends(get_db)):
    """Pregnancy Profile Setup. Requires consent first."""
    if not current_mother["consent_given"]:
        raise HTTPException(status_code=403, detail="Please accept the consent screen first")
    pid = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    await connection.execute(
        """INSERT INTO pregnancies (id, mother_id, current_week, next_visit_date, has_high_bp,
            has_gestational_diabetes, bp_limit_systolic, bp_limit_diastolic,
            sugar_limit_fasting, sugar_limit_post_meal, created_at, updated_at)
           VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11)""",
        pid, current_mother["id"], payload.current_week, payload.next_visit_date,
        payload.has_high_bp, payload.has_gestational_diabetes, payload.bp_limit_systolic,
        payload.bp_limit_diastolic, payload.sugar_limit_fasting, payload.sugar_limit_post_meal, now,
    )
    # Mirror next_visit_date into Visit so the dashboard can count down to it
    if payload.next_visit_date:
        await connection.execute(
            "INSERT INTO visits (pregnancy_id, visit_date, summary_text) VALUES ($1::uuid, $2, $3)",
            pid, payload.next_visit_date, "Next doctor visit (from profile setup)",
        )
    row = await connection.fetchrow("SELECT * FROM pregnancies WHERE id = $1::uuid", pid)
    return dict(row)


@app.get("/pregnancies/my")
async def my_pregnancies(current_mother=Depends(get_current_mother), connection=Depends(get_db)):
    rows = await connection.fetch(
        "SELECT * FROM pregnancies WHERE mother_id = $1::uuid ORDER BY created_at DESC",
        current_mother["id"],
    )
    return [dict(r) for r in rows]


@app.put("/pregnancies/{pregnancy_id}")
async def update_pregnancy(pregnancy_id: str, payload: PregnancyUpsert,
                           current_mother=Depends(get_current_mother), connection=Depends(get_db)):
    if not await _mother_owns_pregnancy(connection, current_mother["id"], pregnancy_id):
        raise HTTPException(status_code=404, detail="Pregnancy not found")
    await connection.execute(
        """UPDATE pregnancies SET current_week = COALESCE($1, current_week),
            next_visit_date = COALESCE($2, next_visit_date),
            has_high_bp = COALESCE($3, has_high_bp),
            has_gestational_diabetes = COALESCE($4, has_gestational_diabetes),
            bp_limit_systolic = COALESCE($5, bp_limit_systolic),
            bp_limit_diastolic = COALESCE($6, bp_limit_diastolic),
            sugar_limit_fasting = COALESCE($7, sugar_limit_fasting),
            sugar_limit_post_meal = COALESCE($8, sugar_limit_post_meal),
            updated_at = NOW() WHERE id = $9::uuid""",
        payload.current_week, payload.next_visit_date, payload.has_high_bp,
        payload.has_gestational_diabetes, payload.bp_limit_systolic, payload.bp_limit_diastolic,
        payload.sugar_limit_fasting, payload.sugar_limit_post_meal, pregnancy_id,
    )
    return dict(await connection.fetchrow("SELECT * FROM pregnancies WHERE id = $1::uuid", pregnancy_id))


@app.post("/entries")
async def create_entry(payload: EntryCreate, current_mother=Depends(get_current_mother),
                       connection=Depends(get_db)):
    """Tracker data -> Entry table (bp tracker / sugar tracker)."""
    if not await _mother_owns_pregnancy(connection, current_mother["id"], payload.pregnancy_id):
        raise HTTPException(status_code=404, detail="Pregnancy not found")
    eid = str(uuid.uuid4())
    await connection.execute(
        "INSERT INTO entries (id, pregnancy_id, type, value_json, note) VALUES ($1::uuid, $2::uuid, $3, $4, $5)",
        eid, payload.pregnancy_id, payload.type, json.dumps(payload.value_json), payload.note,
    )
    return dict(await connection.fetchrow("SELECT * FROM entries WHERE id = $1::uuid", eid))


@app.get("/entries")
async def list_entries(pregnancy_id: str, entry_type: Optional[str] = None,
                       current_mother=Depends(get_current_mother), connection=Depends(get_db)):
    if not await _mother_owns_pregnancy(connection, current_mother["id"], pregnancy_id):
        raise HTTPException(status_code=404, detail="Pregnancy not found")
    if entry_type:
        rows = await connection.fetch(
            "SELECT * FROM entries WHERE pregnancy_id = $1::uuid AND type = $2 ORDER BY created_at DESC",
            pregnancy_id, entry_type,
        )
    else:
        rows = await connection.fetch(
            "SELECT * FROM entries WHERE pregnancy_id = $1::uuid ORDER BY created_at DESC", pregnancy_id,
        )
    return [dict(r) for r in rows]


@app.post("/visits")
async def create_visit(payload: VisitCreate, current_mother=Depends(get_current_mother),
                       connection=Depends(get_db)):
    if not await _mother_owns_pregnancy(connection, current_mother["id"], payload.pregnancy_id):
        raise HTTPException(status_code=404, detail="Pregnancy not found")
    vid = str(uuid.uuid4())
    await connection.execute(
        "INSERT INTO visits (id, pregnancy_id, visit_date, summary_text) VALUES ($1::uuid, $2::uuid, $3, $4)",
        vid, payload.pregnancy_id, payload.visit_date, payload.summary_text,
    )
    return dict(await connection.fetchrow("SELECT * FROM visits WHERE id = $1::uuid", vid))


@app.get("/visits")
async def list_visits(pregnancy_id: str, current_mother=Depends(get_current_mother),
                      connection=Depends(get_db)):
    if not await _mother_owns_pregnancy(connection, current_mother["id"], pregnancy_id):
        raise HTTPException(status_code=404, detail="Pregnancy not found")
    rows = await connection.fetch(
        "SELECT * FROM visits WHERE pregnancy_id = $1::uuid ORDER BY visit_date ASC", pregnancy_id,
    )
    return [dict(r) for r in rows]


# ---------------------------------------------------------------------------
# Child Health Card (tagged to Mother + specific Pregnancy = prenatal environment)
# Philosophy: the child grew in the mother for 9 months; that environment
# (high BP / gestational diabetes / doctor limits) is inherited as read-only
# "Prenatal Environment Context" on every child response.
# ---------------------------------------------------------------------------

class ChildCreate(BaseModel):
    pregnancy_id: str = Field(...)
    name: str = Field(default="Baby", min_length=1)
    birth_date: Optional[str] = Field(default=None)
    gender: Optional[str] = Field(default=None, pattern="^(female|male|other)$")
    birth_weight_kg: Optional[float] = Field(default=None, ge=0.3, le=8)
    birth_length_cm: Optional[float] = Field(default=None)
    delivery_type: Optional[str] = Field(default=None)
    current_weight_kg: Optional[float] = Field(default=None)
    current_height_cm: Optional[float] = Field(default=None)
    blood_group: Optional[str] = Field(default=None)
    notes: Optional[str] = Field(default=None)


class ChildUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1)
    birth_date: Optional[str] = Field(default=None)
    gender: Optional[str] = Field(default=None, pattern="^(female|male|other)$")
    birth_weight_kg: Optional[float] = Field(default=None, ge=0.3, le=8)
    birth_length_cm: Optional[float] = Field(default=None)
    delivery_type: Optional[str] = Field(default=None)
    current_weight_kg: Optional[float] = Field(default=None)
    current_height_cm: Optional[float] = Field(default=None)
    blood_group: Optional[str] = Field(default=None)
    notes: Optional[str] = Field(default=None)


def _prenatal_context(pregnancy_row) -> dict:
    """Read-only inherited environment pulled from the linked Pregnancy record."""
    p = dict(pregnancy_row)
    return {
        "pregnancy_id": str(p["id"]),
        "current_week": p.get("current_week"),
        "has_high_bp": p.get("has_high_bp"),
        "has_gestational_diabetes": p.get("has_gestational_diabetes"),
        "bp_limit_systolic": p.get("bp_limit_systolic"),
        "bp_limit_diastolic": p.get("bp_limit_diastolic"),
        "sugar_limit_fasting": p.get("sugar_limit_fasting"),
        "sugar_limit_post_meal": p.get("sugar_limit_post_meal"),
    }


async def _mother_owns_child(connection, mother_id: str, child_id: str):
    row = await connection.fetchrow(
        "SELECT id FROM children WHERE id = $1::uuid AND mother_id = $2::uuid",
        child_id, mother_id,
    )
    return row is not None


@app.post("/children")
async def create_child(payload: ChildCreate, current_mother=Depends(get_current_mother),
                       connection=Depends(get_db)):
    """Create a Child Health Card linked to Mother + one specific Pregnancy (one card per pregnancy)."""
    if not current_mother["consent_given"]:
        raise HTTPException(status_code=403, detail="Please accept the consent screen first")
    if not await _mother_owns_pregnancy(connection, current_mother["id"], payload.pregnancy_id):
        raise HTTPException(status_code=404, detail="Pregnancy not found")
    existing = await connection.fetchrow(
        "SELECT id FROM children WHERE pregnancy_id = $1::uuid", payload.pregnancy_id
    )
    if existing:
        raise HTTPException(status_code=409, detail="A Child Health Card already exists for this pregnancy")
    cid = str(uuid.uuid4())
    await connection.execute(
        """INSERT INTO children (id, mother_id, pregnancy_id, name, birth_date, gender,
            birth_weight_kg, birth_length_cm, delivery_type,
            current_weight_kg, current_height_cm, blood_group, notes)
           VALUES ($1::uuid, $2::uuid, $3::uuid, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)""",
        cid, current_mother["id"], payload.pregnancy_id, payload.name, payload.birth_date,
        payload.gender, payload.birth_weight_kg, payload.birth_length_cm, payload.delivery_type,
        payload.current_weight_kg, payload.current_height_cm, payload.blood_group, payload.notes,
    )
    child = dict(await connection.fetchrow("SELECT * FROM children WHERE id = $1::uuid", cid))
    preg = await connection.fetchrow("SELECT * FROM pregnancies WHERE id = $1::uuid", payload.pregnancy_id)
    return {**child, "prenatal_environment": _prenatal_context(preg)}


@app.get("/children")
async def list_children(pregnancy_id: Optional[str] = None,
                        current_mother=Depends(get_current_mother), connection=Depends(get_db)):
    if pregnancy_id:
        if not await _mother_owns_pregnancy(connection, current_mother["id"], pregnancy_id):
            raise HTTPException(status_code=404, detail="Pregnancy not found")
        rows = await connection.fetch(
            "SELECT * FROM children WHERE mother_id = $1::uuid AND pregnancy_id = $2::uuid ORDER BY created_at DESC",
            current_mother["id"], pregnancy_id,
        )
    else:
        rows = await connection.fetch(
            "SELECT * FROM children WHERE mother_id = $1::uuid ORDER BY created_at DESC",
            current_mother["id"],
        )
    out = []
    for r in rows:
        preg = await connection.fetchrow(
            "SELECT * FROM pregnancies WHERE id = $1::uuid", str(r["pregnancy_id"])
        )
        out.append({**dict(r), "prenatal_environment": _prenatal_context(preg) if preg else None})
    return out


@app.get("/children/{child_id}")
async def get_child(child_id: str, current_mother=Depends(get_current_mother),
                    connection=Depends(get_db)):
    """Child card + inherited read-only Prenatal Environment Context."""
    child = await connection.fetchrow(
        "SELECT * FROM children WHERE id = $1::uuid AND mother_id = $2::uuid",
        child_id, current_mother["id"],
    )
    if child is None:
        raise HTTPException(status_code=404, detail="Child Health Card not found")
    preg = await connection.fetchrow(
        "SELECT * FROM pregnancies WHERE id = $1::uuid", str(child["pregnancy_id"])
    )
    return {**dict(child), "prenatal_environment": _prenatal_context(preg) if preg else None}


@app.put("/children/{child_id}")
async def update_child(child_id: str, payload: ChildUpdate,
                       current_mother=Depends(get_current_mother), connection=Depends(get_db)):
    """Update ongoing growth metrics. Prenatal context is never editable here — it stays inherited."""
    if not await _mother_owns_child(connection, current_mother["id"], child_id):
        raise HTTPException(status_code=404, detail="Child Health Card not found")
    await connection.execute(
        """UPDATE children SET name = COALESCE($1, name),
            birth_date = COALESCE($2, birth_date), gender = COALESCE($3, gender),
            birth_weight_kg = COALESCE($4, birth_weight_kg),
            birth_length_cm = COALESCE($5, birth_length_cm),
            delivery_type = COALESCE($6, delivery_type),
            current_weight_kg = COALESCE($7, current_weight_kg),
            current_height_cm = COALESCE($8, current_height_cm),
            blood_group = COALESCE($9, blood_group), notes = COALESCE($10, notes),
            updated_at = NOW() WHERE id = $11::uuid""",
        payload.name, payload.birth_date, payload.gender, payload.birth_weight_kg,
        payload.birth_length_cm, payload.delivery_type, payload.current_weight_kg,
        payload.current_height_cm, payload.blood_group, payload.notes, child_id,
    )
    child = dict(await connection.fetchrow("SELECT * FROM children WHERE id = $1::uuid", child_id))
    preg = await connection.fetchrow(
        "SELECT * FROM pregnancies WHERE id = $1::uuid", str(child["pregnancy_id"])
    )
    return {**child, "prenatal_environment": _prenatal_context(preg) if preg else None}


# ---------------------------------------------------------------------------
# Run script
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    from datetime import timedelta
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=int(os.getenv("PORT", 8000)),
        # reload=True  # Remove for production
    )