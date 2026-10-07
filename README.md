# 🌸 MaatriSakhi — Preconception Care Assistant

<p align="center">
  <img src="./public/MaatriSakhi.png" alt="MaatriSakhi Logo" width="350"/>
</p>

<p align="center">
  <strong>AI-Assisted Preconception Care & Clinical Screening</strong>
</p>

<p align="center">
  A conversational pre-consultation assistant designed to help patients
  organize their information before meeting a healthcare professional.
</p>

---

Live URL: https://maatrisakhi.onrender.com/

Demo: https://youtu.be/oe1OXRG6B8c?si=8Ibr8IpfuBgEiKTu

---



## 📖 Primary Clinical References

This application is strictly grounded in the official medical guidelines of the **Federation of Obstetric and Gynaecological Societies of India (FOGSI)**:

1. **Preconception Care E-Booklet, Book 1**: *"Preconception: Building the Foundation for a Healthy Mother & a Healthy Future"*
   - *Editor-in-Chief*: Dr. Bhaskar Pal (President, FOGSI)
   - *Editors*: Dr. Suvarna Khadilkar, Dr. Priti Kumar, Dr. Poonam Goyal (Chairperson, Safe Motherhood Committee)
2. **FOGSI Preconception Care — Complete Clinician Checklist**
   - 12 structured clinical protocols covering pregnancy intention, medical disorders, previous obstetric complications, medications, genetic carrier risks, immunization, environmental toxins, lifestyle, and mental health.

---

## 🛡️ Strict Medical Safety Guardrails

- **Pre-Consultation Assistant Only**: The application does **NOT** diagnose medical conditions, prescribe drugs, or substitute for a qualified doctor.
- **Topics Flagged for Clinician Review**: Uses neutral reminders with status indicators (🟢 No issue reported, 🟡 Review with clinician, 🔴 Important clinician attention) rather than synthetic, alarmist "risk scores".
- **Medication Review Without Hazardous Discontinuation**: Never independently tells a patient to stop medicines (particularly psychotropic, antihypertensive, or anti-epileptic drugs), avoiding dangerous withdrawal relapses.
- **Evidence-Based Folic Acid Recommendations**: Explains FOGSI preconception folic acid guidelines:
  - *Low Risk*: 400–800 μg/day starting at least 1 month before conception.
  - *Higher Risk (Diabetes, Epilepsy, prior Neural Tube Defect)*: 4–5 mg/day starting 1–3 months before conception.

---

## ✨ Key Features

1. **One Question at a Time Conversational Experience**:
   - Clean, friendly digital health assistant avoiding overwhelming hospital forms.
   - Large, accessible **Green YES** (`#16a34a`), **Red NO** (`#dc2626`), and **Slate NOT SURE** (`#475569`) buttons.
2. **Voice-First & Text-To-Speech**:
   - Web Speech API integration (`SpeechRecognition`) for hands-free answering in native languages.
   - Built-in Text-To-Speech (`SpeechSynthesis`) with play/stop controls and an auto-read toggle.
3. **8 Indian Languages Supported**:
   - English, हिंदी (Hindi), తెలుగు (Telugu), தமிழ் (Tamil), ಕನ್ನಡ (Kannada), മലയാളം (Malayalam), বাংলা (Bengali), मराठी (Marathi).
   - Medical terms annotated with parenthetical English names for clinical clarity.
4. **Smart Branching Logic**:
   - Adaptive follow-up questions triggered only when relevant (e.g. asking for HbA1c and duration only if diabetes is reported; skipping obstetric complications if nulliparous).
5. **Preconception Consultation Summary & Clinician Dashboard**:
   - Categorized pre-visit summary ready before the patient enters the consultation chamber.
   - Rule-based flags highlighting critical clinical review items.
   - Direct FOGSI booklet page and checklist citations.
   - Doctor's consultation notes and sign-off checkbox (*"Checklist completed and discussed with the couple"*).
   - Print & PDF export layout optimized for hospital records.
6. **One-Click Realistic Demo Patient**:
   - Instant simulation of a patient case (*Ananya Sharma*, 28, planning conception, mild hypothyroidism on levothyroxine, not yet taking folic acid, partner smoking) to test the entire end-to-end workflow in seconds.
7. **One-Click Mother Demo Account** (Pregnancy + Child flows):
   - Email: `mother@maatri.sakhi` · Password: `mother123` (same convention as the doctor demo: `doctor@maatri.sakhi` / `doctor123`).
   - Pre-seeded with consent given + a week-38 pregnancy (high BP + gestational diabetes + doctor limits, visit in 7 days) so both trackers and the Child Health Card creation flow are immediately explorable. Works online (Postgres) and offline (local demo store).
   - The doctor login screen has a matching one-click demo (`doctor@maatri.sakhi` / `doctor123`).
8. **Ask-Your-Doctor + Home Readings Sharing**:
   - Mother dashboard shows **top 3 smart question suggestions** built from her week, limits, visit date and home readings (tap to ask), plus a free-text question box (`questions` table).
   - A **“Share with doctor” toggle** (`doctor_access_granted`) lets home-checked BP/sugar readings and open questions appear in the doctor dashboard's **Home readings** tab.
9. **Shareable Patient Reports**:
   - Doctor dashboard **“Share with patient”** button: native share sheet (WhatsApp/email) when available, else an openable hosted link (+ copy + WhatsApp send), else download. Reports reference attached images/PDFs.

---

## 🤱 Pregnancy Companion Mode (In Development)

**Phase 1: Storage, Login, Consent** - Database infrastructure implemented:
- PostgreSQL database with 4 new tables (mothers, pregnancies, entries, visits)
- JSON schema validation for all data
- DPDP Act 2023 consent compliance
- Medical thresholds marked as "placeholders, to be confirmed by clinicians"
- Render.com PostgreSQL deployment ready

**Phase 2-11: Mode Switch & Pregnancy Features** - Not yet implemented.
- New "I'm pregnant" mode will run alongside existing "Planning a pregnancy" flow
- Uses separate database tables to maintain zero impact on existing preconception data
- All 8 languages and voice support will carry over
- Existing preconception app flow completely unchanged

**Safety**: FOGSI guidelines only, pre-consultation only, no diagnoses, no prescriptions, never advise stopping medication. Out-of-range readings show "Contact your doctor" only.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/alwaysalearner1234/MaatriSakhi.git
cd MaatriSakhi

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📂 Project Architecture

```
MaatriSakhi/
├── public/
├── src/
│   ├── components/
│   │   ├── AboutModal.jsx          # FOGSI guidelines & safety modal
│   │   ├── ChatInterface.jsx       # Conversational chatbot with voice/TTS
│   │   ├── DoctorDashboard.jsx     # Clinician pre-visit summary & review flags
│   │   ├── LanguageSelector.jsx    # 8-language selection cards
│   │   ├── PatientReview.jsx       # Pre-submission review & answer editing
│   │   └── WelcomeScreen.jsx       # Reassuring welcome & safety disclaimer
│   ├── data/
│   │   ├── demoData.js             # Realistic simulated patient profiles
│   │   ├── fogsiQuestions.js       # Structured FOGSI questions & flag logic
│   │   └── translations.js         # Multi-language dictionaries
│   ├── utils/
│   │   └── speechUtils.js          # Web Speech API recognition & TTS synthesis
│   ├── App.jsx                     # Core application coordinator
│   ├── index.css                   # Responsive FOGSI clinical design system
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Render Deployment Instructions

### Prerequisites
- Render.com account
- Supabase project (free tier OK)

### 1. Get Supabase Connection String
1. Go to Supabase dashboard → Settings → Database
2. Note the "Connection string" for the "Postgres pooler (session mode)"
3. It will look like: `postgresql://postgres:password@db.xxx.supabase.co:6543/postgres`

### 2. Add Python Web Service
1. Go to Render dashboard → New Web Service
2. Select "Deploy from a Git Repository"
3. Repository: your MaatriSakhi repo
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
6. Service Type: Web Service

### 3. Environment Variables
Add these to the Web Service:
```env
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:6543/postgres?sslmode=require
SECRET_KEY=your-super-secret-key-for-jwt-tokens
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost:5173
```

### 4. requirements.txt
Create `requirements.txt` at the project root:
```
fastapi
uvicorn[standard]
asyncpg
bcrypt
PyJWT
pydantic
```

### 5. Deploy
- Push code to git
- Render will auto-detect and build
- The Static Site serves the React frontend on port 80
- The Python Web Service runs the API on port `$PORT`

### 6. Verify
- Frontend: `https://maatrisakhi.onrender.com/` (React SPA)
- API: `https://your-service-name.onrender.com/docs` (FastAPI auto-docs)
- Health: `https://your-service-name.onrender.com/health`

---

## 📜 License & Medical Disclaimer

Designed for clinical workflow assistance. The tool collects information for healthcare consultations and does not replace medical advice, clinical diagnosis, or patient-physician evaluation.
