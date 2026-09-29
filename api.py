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