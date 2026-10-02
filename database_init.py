"""Database initialization for MaatriSakhi Pregnancy Companion.

Creates all required tables in dependency order:
  doctors, patients, pregnancies, entries, visits

Uses DATABASE_URL environment variable for connection.
Enables Row Level Security on all tables.
Seeds a demo doctor if none exists.
Safe to run multiple times.
"""
from dotenv import load_dotenv
load_dotenv(override=True)
import os
import uuid
import bcrypt
from datetime import datetime

import asyncpg
import jwt

from jsonschema import Draft202012Validator

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set")

# ---------------------------------------------------------------------------
# Schema definitions (matching the original design)
# ---------------------------------------------------------------------------

# Mother table schema (Mother role: signup/login + consent, DPDP Act 2023)
MOTHER_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["id", "name", "email", "password_hash", "consent_given"],
    "properties": {
        "id": {"type": "string", "format": "uuid"},
        "name": {"type": "string", "minLength": 1},
        "email": {"type": "string", "format": "email"},
        "password_hash": {"type": "string"},
        "language": {
            "type": "string",
            "enum": ["en", "hi", "te", "ta", "kn", "ml", "bn", "mr"],
        },
        "consent_given": {"type": "boolean"},
        "consent_at": {"type": ["string", "null"], "format": "date-time"},
        "created_at": {"type": "string", "format": "date-time"},
    },
}

# Pregnancy table schema
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

# Entry table schema
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

# Visit table schema
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

# Doctor table schema (doctor-centric pivot)
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

# Patient table schema (doctor-centric pivot)
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

# Child Health Card schema — tagged to Mother AND the specific Pregnancy
# (the 9-month prenatal environment). Postnatal: birth + ongoing growth metrics.
CHILD_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["id", "mother_id", "pregnancy_id"],
    "properties": {
        "id": {"type": "string", "format": "uuid"},
        "mother_id": {"type": "string", "format": "uuid"},
        "pregnancy_id": {"type": "string", "format": "uuid"},
        "name": {"type": "string", "minLength": 1},
        "birth_date": {"type": ["string", "null"], "format": "date"},
        "gender": {"type": ["string", "null"], "enum": ["female", "male", "other"]},
        "birth_weight_kg": {"type": ["number", "null"], "minimum": 0.3, "maximum": 8},
        "birth_length_cm": {"type": ["number", "null"]},
        "delivery_type": {"type": ["string", "null"]},
        "current_weight_kg": {"type": ["number", "null"]},
        "current_height_cm": {"type": ["number", "null"]},
        "blood_group": {"type": ["string", "null"]},
        "notes": {"type": ["string", "null"]},
        "created_at": {"type": "string", "format": "date-time"},
        "updated_at": {"type": "string", "format": "date-time"},
    },
}

# Create validators
mother_validator = Draft202012Validator(MOTHER_SCHEMA)
pregnancy_validator = Draft202012Validator(PREGNANCY_SCHEMA)
entry_validator = Draft202012Validator(ENTRY_SCHEMA)
visit_validator = Draft202012Validator(VISIT_SCHEMA)
child_validator = Draft202012Validator(CHILD_SCHEMA)

# Row Level Security - enable on all tables so Supabase public Data API cannot read data
# Our backend connects as the postgres user, so it still has full access
RLS_STATEMENTS = [
    "ALTER TABLE mothers ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE pregnancies ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE entries ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE visits ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE children ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE doctors ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE patients ENABLE ROW LEVEL SECURITY",
]


# ---------------------------------------------------------------------------
# Database initialization
# ---------------------------------------------------------------------------

async def initialize_database():
    """Create all tables and enable UUID extension.

    Must be called once on app startup.
    Creates tables in dependency order, enables RLS, and seeds a demo doctor.
    Safe to run multiple times - uses CREATE TABLE IF NOT EXISTS and
    INSERT ... ON CONFLICT for the demo doctor.
    """
    pool = await asyncpg.create_pool(
        DATABASE_URL,
        min_size=2,
        max_size=10,
        command_timeout=60,
    )

    try:
        async with pool.acquire() as connection:
            async with connection.transaction():
                # Enable UUID extension
                await connection.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")

                # 1. Create doctors table FIRST (must exist before patients references it)
                await connection.execute("""
                    CREATE TABLE IF NOT EXISTS doctors (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        email VARCHAR(255) UNIQUE NOT NULL,
                        name VARCHAR(255) NOT NULL,
                        password_hash VARCHAR(255) NOT NULL,
                        created_at TIMESTAMPTZ DEFAULT NOW()
                    );
                """)

                # 2. Create patients table (references doctors)
                await connection.execute("""
                    CREATE TABLE IF NOT EXISTS patients (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
                        name VARCHAR(255) NOT NULL,
                        phone VARCHAR(50),
                        language VARCHAR(10) DEFAULT 'en',
                        consent_given BOOLEAN DEFAULT FALSE,
                        consent_at TIMESTAMPTZ,
                        doctor_description TEXT,
                        status VARCHAR(50) DEFAULT 'Active',
                        created_at TIMESTAMPTZ DEFAULT NOW(),
                        updated_at TIMESTAMPTZ DEFAULT NOW()
                    );
                """)

                # 3. Create mothers table (Mother role: signup/login + consent)
                await connection.execute("""
                    CREATE TABLE IF NOT EXISTS mothers (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        password_hash VARCHAR(255) NOT NULL,
                        language VARCHAR(10) DEFAULT 'en',
                        consent_given BOOLEAN NOT NULL DEFAULT FALSE,
                        consent_at TIMESTAMPTZ,
                        created_at TIMESTAMPTZ DEFAULT NOW(),
                        updated_at TIMESTAMPTZ DEFAULT NOW()
                    );
                """)
                # Self-heal columns for DBs created before Mother auth existed
                await connection.execute("""
                    DO $$ BEGIN
                        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                                       WHERE table_name='mothers' AND column_name='password_hash') THEN
                            ALTER TABLE mothers ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT '';
                        END IF;
                        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                                       WHERE table_name='mothers' AND column_name='updated_at') THEN
                            ALTER TABLE mothers ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
                        END IF;
                    END $$;
                """)
                await connection.execute(
                    "CREATE INDEX IF NOT EXISTS idx_mothers_email ON mothers(email);"
                )

                # 4. Create pregnancies table (references mothers)
                await connection.execute("""
                    CREATE TABLE IF NOT EXISTS pregnancies (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        mother_id UUID NOT NULL REFERENCES mothers(id) ON DELETE CASCADE,
                        current_week INTEGER,
                        next_visit_date DATE,
                        has_high_bp BOOLEAN,
                        has_gestational_diabetes BOOLEAN,
                        bp_limit_systolic INTEGER,
                        bp_limit_diastolic INTEGER,
                        sugar_limit_fasting INTEGER,
                        sugar_limit_post_meal INTEGER,
                        doctor_access_granted BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMPTZ DEFAULT NOW(),
                        updated_at TIMESTAMPTZ DEFAULT NOW()
                    );
                """)

                # 5. Create entries table (references pregnancies)
                await connection.execute("""
                    CREATE TABLE IF NOT EXISTS entries (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        pregnancy_id UUID NOT NULL REFERENCES pregnancies(id) ON DELETE CASCADE,
                        type VARCHAR(20) NOT NULL CHECK (type IN ('bp', 'sugar', 'symptom', 'report')),
                        value_json JSONB NOT NULL,
                        note TEXT,
                        file_path VARCHAR(500),
                        created_at TIMESTAMPTZ DEFAULT NOW()
                    );
                """)

                # 6. Create visits table (references pregnancies)
                await connection.execute("""
                    CREATE TABLE IF NOT EXISTS visits (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        pregnancy_id UUID NOT NULL REFERENCES pregnancies(id) ON DELETE CASCADE,
                        visit_date DATE NOT NULL,
                        summary_text TEXT,
                        docx_path VARCHAR(500),
                        created_at TIMESTAMPTZ DEFAULT NOW()
                    );
                """)

                # 7. Create children table (Child Health Card: Mother + specific Pregnancy)
                await connection.execute("""
                    CREATE TABLE IF NOT EXISTS children (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        mother_id UUID NOT NULL REFERENCES mothers(id) ON DELETE CASCADE,
                        pregnancy_id UUID NOT NULL REFERENCES pregnancies(id) ON DELETE CASCADE,
                        name VARCHAR(255) NOT NULL DEFAULT 'Baby',
                        birth_date DATE,
                        gender VARCHAR(20) CHECK (gender IS NULL OR gender IN ('female', 'male', 'other')),
                        birth_weight_kg DECIMAL(5,3) CHECK (birth_weight_kg IS NULL OR (birth_weight_kg >= 0.3 AND birth_weight_kg <= 8)),
                        birth_length_cm DECIMAL(5,2),
                        delivery_type VARCHAR(30),
                        current_weight_kg DECIMAL(5,2),
                        current_height_cm DECIMAL(5,2),
                        blood_group VARCHAR(10),
                        notes TEXT,
                        created_at TIMESTAMPTZ DEFAULT NOW(),
                        updated_at TIMESTAMPTZ DEFAULT NOW(),
                        UNIQUE (pregnancy_id)
                    );
                """)
                await connection.execute(
                    "CREATE INDEX IF NOT EXISTS idx_children_mother ON children(mother_id);"
                )
                await connection.execute(
                    "CREATE INDEX IF NOT EXISTS idx_children_pregnancy ON children(pregnancy_id);"
                )

                # Enable Row Level Security on all tables
                # This prevents Supabase public Data API from reading patient data
                # Our backend connects as the postgres user, so it still has full access
                for statement in RLS_STATEMENTS:
                    await connection.execute(statement)

                # Seed a demo doctor if none exists
                count = await connection.fetchval("SELECT COUNT(*) FROM doctors")
                if count == 0:
                    hashed_pw = bcrypt.hashpw("doctor123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
                    await connection.execute(
                        "INSERT INTO doctors (email, name, password_hash) VALUES ($1, $2, $3)",
                        "doctor@maatri.sakhi",
                        "Demo Doctor",
                        hashed_pw,
                    )

    # Close pool in finally to avoid Windows "Event loop is closed" SSL errors
    finally:
        await pool.close()

    print("✅ Database initialized successfully")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import asyncio

    async def run():
        await initialize_database()

    asyncio.run(run())