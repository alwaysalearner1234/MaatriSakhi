"""Database initialization for MaatriSakhi Pregnancy Companion.

Creates the 4 required tables:
  mothers, pregnancies, entries, visits

Uses DATABASE_URL environment variable for connection.
"""

import os
import uuid
from datetime import datetime

import asyncpg

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

# Mother table schema (aligned with DPDP Act 2023)
MOTHER_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["id", "name", "language", "consent_given"],
    "properties": {
        "id": {"type": "string", "format": "uuid"},
        "name": {"type": "string", "minLength": 1},
        "language": {
            "type": "string",
            "enum": ["en", "hi", "te", "ta", "kn", "ml", "bn", "mr"],
        },
        "consent_given": {"type": "boolean"},
        "consent_at": {"type": ["string", "null"], "format": "date-time"},
        "email": {"type": ["string", "null"], "format": "email"},
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

# Create validators
mother_validator = Draft202012Validator(MOTHER_SCHEMA)
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
# Database initialization
# ---------------------------------------------------------------------------


async def initialize_database():
    """Create all tables and enable UUID extension.

    Must be called once on app startup.
    """
    pool = await asyncpg.create_pool(
        DATABASE_URL,
        min_size=2,
        max_size=10,
        command_timeout=60,
    )

    async with pool.acquire() as connection:
        # Enable UUID extension
        await connection.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")

        # Create mothers table
        await connection.execute("""
            CREATE TABLE IF NOT EXISTS mothers (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) NOT NULL,
                language VARCHAR(10) DEFAULT 'en',
                consent_given BOOLEAN DEFAULT FALSE,
                consent_at TIMESTAMPTZ,
                email VARCHAR(255),
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        """)

        # Create pregnancies table
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

        # Create entries table
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

        # Create visits table
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

        # Create patients table (doctor-centric: each patient belongs to one doctor)
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

        # Create triggers for updated_at
        await connection.execute("""
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        """)

        # Trigger for mothers
        await connection.execute("""
            DROP TRIGGER IF EXISTS update_mothers_updated_at ON mothers;
            CREATE TRIGGER update_mothers_updated_at
                BEFORE UPDATE ON mothers
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        """)

        # Trigger for pregnancies
        await connection.execute("""
            DROP TRIGGER IF EXISTS update_pregnancies_updated_at ON pregnancies;
            CREATE TRIGGER update_pregnancies_updated_at
                BEFORE UPDATE ON pregnancies
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        """)

        # Trigger for entries
        await connection.execute("""
            DROP TRIGGER IF EXISTS update_entries_updated_at ON entries;
            CREATE TRIGGER update_entries_updated_at
                BEFORE UPDATE ON entries
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        """)

        # Trigger for visits
        await connection.execute("""
            DROP TRIGGER IF EXISTS update_visits_updated_at ON visits;
            CREATE TRIGGER update_visits_updated_at
                BEFORE UPDATE ON visits
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        """)

    # Close pool
    await pool.close()

    print("✅ Database initialized successfully")


# ---------------------------------------------------------------------------
# Migration / validation helper
# ---------------------------------------------------------------------------

async def validate_and_insert_mother(data: dict, connection) -> str:
    """Validate mother data and insert into DB. Returns mother ID."""
    errors = validate_model(data, mother_validator)
    if errors:
        raise ValueError(f"Mother schema validation failed: {'; '.join(errors)}")

    # Ensure UUID format for id
    if "id" not in data:
        data["id"] = str(uuid.uuid4())

    # Set defaults
    if "consent_given" not in data:
        data["consent_given"] = False
    if "language" not in data:
        data["language"] = "en"
    if "created_at" not in data:
        data["created_at"] = datetime.utcnow().isoformat()
    if "updated_at" not in data:
        data["updated_at"] = data["created_at"]

    # Insert
    result = await connection.fetchrow(
        """INSERT INTO mothers (id, name, language, consent_given, consent_at, created_at, updated_at)
           VALUES ($1::uuid, $2, $3, $4, $5, $6, $7)
           RETURNING id, name, language, consent_given, consent_at, created_at""",
        data["id"],
        data.get("name"),
        data.get("language", "en"),
        data.get("consent_given", False),
        data.get("consent_at"),
        data.get("created_at"),
        data.get("updated_at"),
    )

    return str(result["id"])


async def validate_and_insert_pregnancy(data: dict, connection) -> str:
    """Validate pregnancy data and insert into DB. Returns pregnancy ID."""
    errors = validate_model(data, pregnancy_validator)
    if errors:
        raise ValueError(f"Pregnancy schema validation failed: {'; '.join(errors)}")

    # Ensure UUID format for id and mother_id
    if "id" not in data:
        data["id"] = str(uuid.uuid4())
    if "mother_id" not in data:
        raise ValueError("mother_id is required for pregnancy")

    # Set defaults
    if "current_week" not in data:
        data["current_week"] = None
    if "next_visit_date" not in data:
        data["next_visit_date"] = None
    if "has_high_bp" not in data:
        data["has_high_bp"] = None
    if "has_gestational_diabetes" not in data:
        data["has_gestational_diabetes"] = None
    if "bp_limit_systolic" not in data:
        data["bp_limit_systolic"] = None
    if "bp_limit_diastolic" not in data:
        data["bp_limit_diastolic"] = None
    if "sugar_limit_fasting" not in data:
        data["sugar_limit_fasting"] = None
    if "sugar_limit_post_meal" not in data:
        data["sugar_limit_post_meal"] = None
    if "doctor_access_granted" not in data:
        data["doctor_access_granted"] = False
    if "created_at" not in data:
        data["created_at"] = datetime.utcnow().isoformat()
    if "updated_at" not in data:
        data["updated_at"] = data["created_at"]

    # Verify mother exists
    mother_exists = await connection.fetchval(
        "SELECT EXISTS(SELECT 1 FROM mothers WHERE id = $1::uuid)",
        data["mother_id"],
    )
    if not mother_exists:
        raise ValueError(f"Mother with id {data['mother_id']} does not exist")

    # Insert
    result = await connection.fetchrow(
        """INSERT INTO pregnancies (id, mother_id, current_week, next_visit_date,
             has_high_bp, has_gestational_diabetes, bp_limit_systolic, bp_limit_diastolic,
             sugar_limit_fasting, sugar_limit_post_meal, doctor_access_granted, created_at, updated_at)
           VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           RETURNING id, mother_id, current_week, next_visit_date, has_high_bp, has_gestational_diabetes,
                     bp_limit_systolic, bp_limit_diastolic, sugar_limit_fasting, sugar_limit_post_meal,
                     doctor_access_granted, created_at, updated_at""",
        data["id"],
        data["mother_id"],
        data.get("current_week"),
        data.get("next_visit_date"),
        data.get("has_high_bp"),
        data.get("has_gestational_diabetes"),
        data.get("bp_limit_systolic"),
        data.get("bp_limit_diastolic"),
        data.get("sugar_limit_fasting"),
        data.get("sugar_limit_post_meal"),
        data.get("doctor_access_granted", False),
        data.get("created_at"),
        data.get("updated_at"),
    )

    return str(result["id"])


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import asyncio

    async def run():
        await initialize_database()

    asyncio.run(run())