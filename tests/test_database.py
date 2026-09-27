"""pytest tests for MaatriSakhi Pregnancy Companion Database.

Run:
    pytest tests/test_database.py -v
"""

import os
import json
import uuid
import pytest
from pytest import fixture, mark

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def random_id():
    """Generate a random UUID string for test IDs."""
    return str(uuid.uuid4())


# ---------------------------------------------------------------------------
# Schema validation tests (no DB required)
# ---------------------------------------------------------------------------

import sys
import importlib

sys.path.insert(0, ".")

try:
    from database_init import (
        initialize_database,
        validate_model,
        mother_validator,
        pregnancy_validator,
    )
except ImportError:
    pytest.exit("Could not import database_init")


# Mother schema validation tests


class TestMotherSchemaValidation:
    """Test mother JSON schema validation."""

    def test_valid_mother_data(self):
        """Valid mother data should pass schema validation."""
        mother_data = {
            "id": random_id(),
            "name": "Test Mother",
            "language": "en",
            "consent_given": True,
            "consent_at": "2024-01-15T10:30:00Z",
        }
        errors = validate_model(mother_data, mother_validator)
        assert errors == [], f"Expected no errors, got: {errors}"

    def test_mother_missing_required_fields(self):
        """Mother data missing required fields should fail validation."""
        mother_data = {
            "name": "Test Mother",
            # missing: id, language, consent_given
        }
        errors = validate_model(mother_data, mother_validator)
        assert len(errors) > 0, "Expected validation errors for missing required fields"

    def test_mother_invalid_language(self):
        """Mother data with invalid language should fail validation."""
        mother_data = {
            "id": random_id(),
            "name": "Test Mother",
            "language": "invalid_lang",
            "consent_given": True,
        }
        errors = validate_model(mother_data, mother_validator)
        assert len(errors) > 0, "Expected validation error for invalid language"


# Pregnancy schema validation tests


class TestPregnancySchemaValidation:
    """Test pregnancy JSON schema validation."""

    def test_valid_pregnancy_data(self):
        """Valid pregnancy data should pass schema validation."""
        mother_id = random_id()
        pregnancy_data = {
            "id": random_id(),
            "mother_id": mother_id,
            "current_week": 24,
            "next_visit_date": "2024-02-15",
            "has_high_bp": False,
            "has_gestational_diabetes": True,
            "bp_limit_systolic": 140,
            "bp_limit_diastolic": 90,
            "sugar_limit_fasting": 140,
            "sugar_limit_post_meal": 200,
            "doctor_access_granted": True,
        }
        errors = validate_model(pregnancy_data, pregnancy_validator)
        assert errors == [], f"Expected no errors, got: {errors}"


# ---------------------------------------------------------------------------
# API endpoint tests (require running server with DB)
# ---------------------------------------------------------------------------

import httpx


class TestAPIEndpoints:
    """Test FastAPI endpoints against running server."""

    @pytest.fixture(scope="function", autouse=True)
    def setup_client(self):
        """Create HTTP client for each test."""
        self.client = httpx.AsyncClient(base_url="http://127.0.0.1:8000")
        yield
        asyncio.run(self.aclose())

    async def aclose(self):
        await self.client.aclose()

    @pytest.mark.asyncio
    async def test_health_endpoint(self):
        """Health endpoint should return ok."""
        response = await self.client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"

    @pytest.mark.asyncio
    async def test_signup_endpoint(self):
        """Signup endpoint should create a doctor account."""
        doctor_data = {
            "email": "testdoctor@example.com",
            "password": "password123",
        }
        response = await self.client.post("/api/auth/signup", json=doctor_data)
        assert response.status_code in (200, 201), f"Signup failed: {response.status_code}, {response.text}"
        data = response.json()
        assert data["doctor"]["name"] is not None
        assert "access_token" in data

    @pytest.mark.asyncio
    async def test_login_endpoint(self):
        """Login endpoint should authenticate and return token."""
        # First signup
        await self.client.post("/api/auth/signup", json={"email": "login@test.com", "password": "pass"})

        # Then login
        response = await self.client.post("/api/auth/login", json={"email": "login@test.com", "password": "pass"})
        assert response.status_code == 200, f"Login failed: {response.status_code}, {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["doctor"]["name"] == "Login"

    @pytest.mark.asyncio
    async def test_auth_without_token_rejected(self):
        """Request to patient endpoint WITHOUT a token should be rejected (401)."""
        # Create a patient first (no auth needed for creation, but we need a patient)
        await self.client.post("/api/auth/signup", json={"email": "patient@test.com", "password": "pass"})
        await self.client.post("/api/auth/login", json={"email": "patient@test.com", "password": "pass"})
        
        # Try to get patients without token
        response = await self.client.get("/patients/my")
        assert response.status_code == 401, f"Expected 401 without token, got {response.status_code}"

    @pytest.mark.asyncio
    async def test_auth_with_token_succeeds(self):
        """Request to patient endpoint WITH a valid token should succeed."""
        # Create doctor and login
        await self.client.post("/api/auth/signup", json={"email": "dr@test.com", "password": "pass"})
        login_response = await self.client.post("/api/auth/login", json={"email": "dr@test.com", "password": "pass"})
        token = login_response.json()["access_token"]
        
        # Add auth header
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get patients with token
        response = await self.client.get("/patients/my", headers=headers)
        assert response.status_code == 200, f"Expected 200 with token, got {response.status_code}: {response.text}"
        data = response.json()
        assert isinstance(data, list)