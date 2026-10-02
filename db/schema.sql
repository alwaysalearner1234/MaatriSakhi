-- ============================================================
-- MaatriSakhi — Mother / Pregnancy schema (PostgreSQL)
-- Works on Render Postgres AND Supabase (Postgres).
-- Exactly 4 tables with FK chain:
--   Mother (1) -> Pregnancy (N) -> Entry (N)
--                               -> Visit  (N)
-- Run with: psql $DATABASE_URL -f db/schema.sql
-- Or auto-created by database_init.py on FastAPI startup.
-- Frontend: React (Vite)  |  Backend: FastAPI (Python, api.py)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1) Mother — the "Mother" user role (signup/login + consent)
CREATE TABLE IF NOT EXISTS mothers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  -- Consent (DPDP Act 2023): NOTHING health-related is collected before this is TRUE
  consent_given BOOLEAN NOT NULL DEFAULT FALSE,
  consent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mothers_email ON mothers(email);

-- 2) Pregnancy — one row per pregnancy profile setup ("I'm pregnant" flow)
CREATE TABLE IF NOT EXISTS pregnancies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mother_id UUID NOT NULL REFERENCES mothers(id) ON DELETE CASCADE,
  current_week INTEGER CHECK (current_week IS NULL OR (current_week >= 1 AND current_week <= 42)),
  next_visit_date DATE,
  has_high_bp BOOLEAN,
  has_gestational_diabetes BOOLEAN,
  -- Doctor's specific safety limits (entered during profile setup)
  bp_limit_systolic INTEGER CHECK (bp_limit_systolic IS NULL OR (bp_limit_systolic >= 50 AND bp_limit_systolic <= 250)),
  bp_limit_diastolic INTEGER CHECK (bp_limit_diastolic IS NULL OR (bp_limit_diastolic >= 30 AND bp_limit_diastolic <= 150)),
  sugar_limit_fasting INTEGER CHECK (sugar_limit_fasting IS NULL OR (sugar_limit_fasting >= 40 AND sugar_limit_fasting <= 400)),
  sugar_limit_post_meal INTEGER CHECK (sugar_limit_post_meal IS NULL OR (sugar_limit_post_meal >= 40 AND sugar_limit_post_meal <= 600)),
  doctor_access_granted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pregnancies_mother ON pregnancies(mother_id);

-- 3) Entry — every tracker reading (BP tracker / Sugar tracker)
-- value_json examples:
--   BP:    {"systolic": 118, "diastolic": 76}
--   Sugar: {"mg_dl": 132, "kind": "fasting" | "post_meal"}
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pregnancy_id UUID NOT NULL REFERENCES pregnancies(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('bp', 'sugar', 'symptom', 'report')),
  value_json JSONB NOT NULL,
  note TEXT,
  file_path VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_entries_pregnancy ON entries(pregnancy_id);
CREATE INDEX IF NOT EXISTS idx_entries_pregnancy_type ON entries(pregnancy_id, type);

-- 4) Visit — upcoming/past doctor visits; dashboard counts down to next_visit_date
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pregnancy_id UUID NOT NULL REFERENCES pregnancies(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  summary_text TEXT,
  docx_path VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_visits_pregnancy ON visits(pregnancy_id);

-- 5) Child — Child Health Card, permanently tagged to the 9-month prenatal environment.
-- FK to Mother (owner) AND to the specific Pregnancy record (prenatal context source).
-- Postnatal data: birth details + ongoing growth metrics (updated via PUT /children/{id}).
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (pregnancy_id)
);
CREATE INDEX IF NOT EXISTS idx_children_mother ON children(mother_id);
CREATE INDEX IF NOT EXISTS idx_children_pregnancy ON children(pregnancy_id);

-- Lock down Supabase public Data API; backend (postgres role) still has full access
ALTER TABLE mothers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pregnancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
