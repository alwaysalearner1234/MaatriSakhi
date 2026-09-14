# 🌸 MaatriSakhi — Preconception Care Assistant

> **A clinical-grade, conversational pre-consultation information collection and risk-screening web application based on the FOGSI Safe Motherhood Committee guidelines.**

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

## 📜 License & Medical Disclaimer

Designed for clinical workflow assistance. The tool collects information for healthcare consultations and does not replace medical advice, clinical diagnosis, or patient-physician evaluation.
