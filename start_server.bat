@echo off
cd /d C:\Users\lidiy\Downloads\MaatriSakhi
set DATABASE_URL=postgresql://postgres:test@localhost:5432/maatri_test
set SECRET_KEY=test-secret-key-12345
python api.py