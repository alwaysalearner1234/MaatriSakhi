"""pytest tests for MaatriSakhi Pregnancy Companion API.

Run:
    pytest tests/ -v
All tests use fastapi.testclient.TestClient - no server needed.
Some tests require a database connection; others test pure API logic.
"""

import os
import uuid
from datetime import datetime

from fastapi.testclient import TestClient

# Set up environment - use separate TEST_DATABASE_URL, never the main database
# because tests create and delete rows
TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql://postgres:test@localhost:5432/maatri_test"
)
os.environ["DATABASE_URL"] = TEST_DATABASE_URL
os.environ["SECRET_KEY"] = os.getenv("SECRET_KEY", "test-secret-key-12345")

import sys
sys.path.insert(0, ".")

from api import app

client = TestClient(app)


# ---------------------------------------------------------------------------
# Schema validation tests (embedded in api.py) - no DB needed
# ---------------------------------------------------------------------------

def test_doctor_schema_valid():
    """Doctor schema validation should pass for valid data."""
    from api import doctor_validator, validate_model
    data = {
        "id": str(uuid.uuid4()),
        "email": "doctor@test.com",
        "name": "Test Doctor",
        "password_hash": "hashed",
    }
    errors = validate_model(data, doctor_validator)
    assert errors == [], f"Expected no errors, got: {errors}"


def test_patient_schema_valid():
    """Patient schema validation should pass for valid data."""
    from api import patient_validator, validate_model
    data = {
        "id": str(uuid.uuid4()),
        "doctor_id": str(uuid.uuid4()),
        "name": "Test Patient",
        "language": "en",
        "consent_given": True,
        "consent_at": "2024-01-15T10:30:00Z",
    }
    errors = validate_model(data, patient_validator)
    assert errors == [], f"Expected no errors, got: {errors}"


# ---------------------------------------------------------------------------
# API endpoint tests using TestClient (no server needed)
# ---------------------------------------------------------------------------

def test_health_endpoint():
    """GET /health should return ok."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_401_without_token():
    """GET /patients/my without a JWT token should return 401."""
    response = client.get("/patients/my")
    assert response.status_code == 401, f"Expected 401 without token, got {response.status_code}"
    assert "detail" in response.json()


def test_schema_tests_only():
    """Run schema validation tests - these don't need DB."""
    pass  # Already tested above


def test_question_schema_valid():
    """Question schema validation should pass for valid data. No DB needed."""
    from api import question_validator, validate_model
    data = {
        "id": str(uuid.uuid4()),
        "mother_id": str(uuid.uuid4()),
        "pregnancy_id": str(uuid.uuid4()),
        "question_text": "My home BP was high, should I come in earlier?",
        "is_suggested": True,
        "status": "open",
        "created_at": "2026-10-02T10:30:00Z",
    }
    errors = validate_model(data, question_validator)
    assert errors == [], f"Expected no errors, got: {errors}"


def test_portal_attachments_to_source():
    """portal_to_source should reference attached files without inventing data. No DB needed."""
    from generator import portal_to_source
    portal = {
        "patient": {"name": "Test", "record_id": "T1"},
        "encounter": {"date": "2026-10-01"},
        "answers": {},
        "history": [],
        "section_notes": {"medical": "TSH note."},
        "section_attachments": {
            "medical": [{"name": "scan.jpg", "url": "/uploads/abc.jpg"}],
        },
        "extra": {"examination": "", "assessment": "", "plan": ""},
        "extra_attachments": {
            "plan": [{"name": "diet.pdf", "url": "/uploads/diet.pdf"}],
        },
    }
    source = portal_to_source(portal)
    medical = source["sections"]["Medical and Surgical History"]
    assert any("scan.jpg" in e and "/uploads/abc.jpg" in e for e in medical), medical
    plan = source["sections"]["Documented Plan and Follow-up"]
    assert any("diet.pdf" in e for e in plan), plan


# The following tests require a database connection and would need
# TEST_DATABASE_URL pointing to a running Postgres instance.
# They are documented here for reference; to run them, start Postgres
# and set TEST_DATABASE_URL to its connection URL.

# def test_signup_endpoint():
#     """POST /auth/signup should create a doctor account."""
#     doctor_data = {"email": "testdoctor@example.com", "password": "password123"}
#     response = client.post("/auth/signup", json=doctor_data)
#     assert response.status_code in (200, 201), f"Signup failed: {response.status_code}, {response.text}"
#     data = response.json()
#     assert data["doctor"]["email"] == "testdoctor@example.com"
#     assert "access_token" in data
#
#
# def test_login_endpoint():
#     """POST /auth/login should authenticate and return token."""
#     # First signup
#     client.post("/auth/signup", json={"email": "login@test.com", "password": "pass"})
#     # Then login
#     response = client.post("/auth/login", json={"email": "login@test.com", "password": "pass"})
#     assert response.status_code == 200, f"Login failed: {response.status_code}, {response.text}"
#     data = response.json()
#     assert "access_token" in data
#     assert data["doctor"]["email"] == "login@test.com"
#
#
# def test_200_with_token():
#     """GET /patients/my with a valid JWT token should return 200."""
#     # Create doctor and login
#     client.post("/auth/signup", json={"email": "dr@test.com", "password": "pass"})
#     login_response = client.post("/auth/login", json={"email": "dr@test.com", "password": "pass"})
#     token = login_response.json()["access_token"]
#     
#     # Get patients with token
#     headers = {"Authorization": f"Bearer {token}"}
#     response = client.get("/patients/my", headers=headers)
#     assert response.status_code == 200, f"Expected 200 with token, got {response.status_code}: {response.text}"
#     data = response.json()
#     assert isinstance(data, list)
#
#
# def test_422_without_consent():
#     """POST /api/patients without consent_given should return 422."""
#     # Create doctor first
#     client.post("/auth/signup", json={"email": "consent@test.com", "password": "pass"})
#     
#     # Try to create patient without consent
#     response = client.post(
#         "/api/patients",
#         json={"name": "Test Patient", "language": "en", "consentGiven": False}
#     )
#     assert response.status_code == 422, f"Expected 422 without consent, got {response.status_code}: {response.text}"
#     detail = response.json().get("detail", "")
#     assert "consent" in detail.lower()
#
#
# def test_404_doctor_b_requests_doctor_a_patient():
#     """Doctor B requesting doctor A's patient should return 404."""
#     # Create doctor A and patient A
#     client.post("/auth/signup", json={"email": "doctor_a@test.com", "password": "pass"})
#     a_login = client.post("/auth/login", json={"email": "doctor_a@test.com", "password": "pass"})
#     a_token = a_login.json()["access_token"]
#     
#     # Create patient under doctor A
#     patient_response = client.post(
#         "/api/patients",
#         json={"name": "Patient A", "language": "en", "consentGiven": True},
#         headers={"Authorization": f"Bearer {a_token}"}
#     )
#     patient_id = patient_response.json()["id"]
#     
#     # Create doctor B and try to access doctor A's patient
#     client.post("/auth/signup", json={"email": "doctor_b@test.com", "password": "pass"})
#     b_login = client.post("/auth/login", json={"email": "doctor_b@test.com", "password": "pass"})
#     b_token = b_login.json()["access_token"]
#     
#     # Try to access doctor A's patient as doctor B
#     headers = {"Authorization": f"Bearer {b_token}"}
#     response = client.get(f"/api/patients/{patient_id}", headers=headers)
#     assert response.status_code == 404, f"Expected 404, got {response.status_code}: {response.text}"
#     assert "not found or not yours" in response.json().get("detail", "").lower()