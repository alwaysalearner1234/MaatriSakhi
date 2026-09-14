import React, { useState } from 'react';
import { UI_TRANSLATIONS } from '../data/translations';
import { generateClinicianFlags, QUESTIONS } from '../data/fogsiQuestions';
import {
  Stethoscope,
  Printer,
  CheckSquare,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  FileText,
  User,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  ShieldAlert
} from 'lucide-react';

export default function DoctorDashboard({
  patientsList,
  currentActivePatientId,
  onSelectPatient,
  onBackToChat
}) {
  const [selectedPatientId, setSelectedPatientId] = useState(currentActivePatientId || patientsList[0]?.id);
  const [doctorNotes, setDoctorNotes] = useState({});
  const [checklistSigned, setChecklistSigned] = useState({});
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'needs_attention'
  const [expandedSections, setExpandedSections] = useState({
    flags: true,
    medical: true,
    medications: true,
    obstetric: true,
    environment: true,
    immunization: true,
    lifestyle: true,
    mental: true,
    investigations: true
  });

  const activePatient = patientsList.find(p => p.id === selectedPatientId) || patientsList[0];
  const t = UI_TRANSLATIONS.en; // Clinician view standardizes primarily in English with medical terminology

  if (!activePatient) {
    return <div className="doctor-portal-container">No patient assessments available yet.</div>;
  }

  const flags = generateClinicianFlags(activePatient.answers || {});
  const attentionFlags = flags.filter(f => f.level === 'attention');
  const reviewFlags = flags.filter(f => f.level === 'review');

  const toggleSection = (sec) => {
    setExpandedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNotesChange = (val) => {
    setDoctorNotes(prev => ({ ...prev, [selectedPatientId]: val }));
  };

  const handleSignToggle = () => {
    setChecklistSigned(prev => ({ ...prev, [selectedPatientId]: !prev[selectedPatientId] }));
  };

  return (
    <div className="doctor-portal-container animate-fade-in">
      {/* Clinician Portal Header */}
      <div className="doctor-header-card">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Stethoscope size={24} color="#f43f5e" />
            <h1>Preconception Pre-Visit Clinician Dashboard</h1>
          </div>
          <p>
            Standardized Pre-Consultation Assessment • FOGSI Safe Motherhood Committee (Book 1 & Clinician Checklist)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }} className="btn-print-hide">
          <button
            className="btn-primary-lg"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', background: 'white', color: '#0f172a' }}
            onClick={handlePrint}
            type="button"
          >
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>

          <button
            className="nav-pill-btn"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
            onClick={onBackToChat}
            type="button"
          >
            <span>Patient View</span>
          </button>
        </div>
      </div>

      {/* Patient Queue Switcher */}
      <div className="btn-print-hide" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-sub)' }}>
            Patient Consultations Queue ({patientsList.length})
          </span>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              className={`nav-pill-btn ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              type="button"
            >
              All
            </button>
            <button
              className={`nav-pill-btn ${filterMode === 'needs_attention' ? 'active' : ''}`}
              onClick={() => setFilterMode('needs_attention')}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              type="button"
            >
              Needs Attention ({patientsList.filter(p => generateClinicianFlags(p.answers).some(f => f.level === 'attention')).length})
            </button>
          </div>
        </div>

        <div className="patient-picker-bar">
          {patientsList
            .filter(p => {
              if (filterMode === 'needs_attention') {
                return generateClinicianFlags(p.answers).some(f => f.level === 'attention');
              }
              return true;
            })
            .map((pt) => {
              const ptFlags = generateClinicianFlags(pt.answers || {});
              const hasRed = ptFlags.some(f => f.level === 'attention');
              const isCurrent = pt.id === selectedPatientId;

              return (
                <button
                  key={pt.id}
                  className={`patient-tab-btn ${isCurrent ? 'active' : ''}`}
                  onClick={() => setSelectedPatientId(pt.id)}
                  type="button"
                >
                  <User size={16} />
                  <span>{pt.name}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '10px',
                    background: isCurrent ? 'rgba(255,255,255,0.25)' : (hasRed ? '#fee2e2' : '#f1f5f9'),
                    color: isCurrent ? 'white' : (hasRed ? '#991b1b' : '#475569'),
                    fontWeight: 700
                  }}>
                    {hasRed ? '🔴 Action' : '🟡 Review'}
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Main Clinical Summary Sheet (Print-ready) */}
      <div className="clinical-summary-sheet">
        {/* Letterhead */}
        <div className="summary-letterhead">
          <div>
            <div className="fogsi-brand-seal">
              FOGSI Safe Motherhood Committee • Preconception Care Initiative
            </div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
              Preconception Pre-Visit Consultation Summary
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Source: FOGSI Preconception Care E-Booklet, Book 1 & Complete Clinician Checklist
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{
              display: 'inline-block',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 800,
              background: checklistSigned[selectedPatientId] ? '#dcfce7' : '#fef3c7',
              color: checklistSigned[selectedPatientId] ? '#166534' : '#92400e'
            }}>
              {checklistSigned[selectedPatientId] ? '✓ Checklist Reviewed & Signed' : 'Pending Clinician Review'}
            </span>
          </div>
        </div>

        {/* Patient Metadata Grid */}
        <div className="summary-patient-meta">
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Patient Name</span>
            <strong>{activePatient.name}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Record / ID</span>
            <strong>{activePatient.id}</strong> {activePatient.isDemo && <span style={{ fontSize: '0.75rem', color: '#e11d48' }}>(Demo)</span>}
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Age</span>
            <strong>{activePatient.age ? `${activePatient.age} Years` : '28 Years'}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Language Used</span>
            <strong style={{ textTransform: 'uppercase' }}>{activePatient.language || 'English'}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Completed</span>
            <strong>{activePatient.completedAt || 'Just now'}</strong>
          </div>
        </div>

        {/* SECTION: TOPICS FLAGGED FOR CLINICIAN REVIEW */}
        <div className="flags-board">
          <div className="flags-board-title">
            <AlertCircle size={20} color="#e11d48" />
            <span>Topics Flagged for Clinician Review</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: 'auto' }}>
              {attentionFlags.length} Attention • {reviewFlags.length} Routine Review
            </span>
          </div>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-sm)',
            padding: '0.65rem 0.9rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem'
          }}>
            <strong>Important Medical Safety Rule:</strong> {t.flagDisclaimer}
          </div>

          {flags.length === 0 ? (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle size={18} />
              <span>No elevated risk flags reported. Routine preconception counselling and standard folic acid recommended.</span>
            </div>
          ) : (
            flags.map((flag) => (
              <div key={flag.id} className={`flag-alert-card ${flag.level}`}>
                <div className="flag-title-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {flag.level === 'attention' ? '🔴' : '🟡'}
                    <span>{flag.title}</span>
                  </span>
                  <span className="flag-badge">
                    {flag.level === 'attention' ? 'Important Attention' : 'Clinician Review'}
                  </span>
                </div>
                <p className="flag-detail-text">{flag.detail}</p>
                <div className="flag-source-ref">
                  Reference: {flag.source}
                </div>
              </div>
            ))
          )}
        </div>

        {/* STRUCTURED HISTORY MAPPED TO FOGSI CLINICIAN CHECKLIST */}
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Structured Preconception History (FOGSI Checklist Items)
          </h3>

          {/* 1. Pregnancy Intention & Spacing */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <span>1. Pregnancy Intention & Spacing</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(FOGSI Checklist #1, E-Booklet p. 9, 13)</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.6rem', fontSize: '0.9rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Planning Pregnancy: </span>
                <strong>{activePatient.answers['planning_pregnancy'] === 'yes' ? 'YES' : 'NO'}</strong>
                {activePatient.answers['pregnancy_timeframe'] && <span> ({activePatient.answers['pregnancy_timeframe'].replace('_', ' ')})</span>}
              </div>
              <div style={{ background: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Prior Deliveries: </span>
                <strong>{activePatient.answers['prior_deliveries'] === 'yes' ? 'YES' : 'None (Nulliparous)'}</strong>
                {activePatient.answers['delivery_interval'] && <span> • Interval: {activePatient.answers['delivery_interval'].replace('_', ' ')}</span>}
              </div>
              <div style={{ background: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Menstrual Regularity: </span>
                <strong>{activePatient.answers['menstrual_regularity'] === 'yes' ? 'Regular (24–35d)' : (activePatient.answers['menstrual_regularity'] === 'no' ? 'Irregular' : 'Uncertain')}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cervical Screening: </span>
                <strong>{activePatient.answers['cervical_screening'] === 'yes' ? 'Up-to-date (<3y)' : 'Uncertain / Due'}</strong>
              </div>
            </div>
          </div>

          {/* 2. Medical Disorders */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <span>2. Medical Disorders Screening</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(FOGSI Checklist #4A, E-Booklet p. 11, 16)</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem', fontSize: '0.88rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Diabetes Mellitus: </span>
                <strong>{activePatient.answers['medical_diabetes'] === 'yes' ? 'YES (Reported)' : 'No'}</strong>
                {activePatient.answers['diabetes_hba1c'] && <div style={{ fontSize: '0.8rem', color: '#991b1b' }}>HbA1c: {activePatient.answers['diabetes_hba1c']}</div>}
              </div>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Chronic Hypertension: </span>
                <strong>{activePatient.answers['medical_hypertension'] === 'yes' ? 'YES (Reported)' : 'No'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Thyroid Disorder: </span>
                <strong>{activePatient.answers['medical_thyroid'] === 'yes' ? 'YES (Reported)' : 'No'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Epilepsy / Convulsions: </span>
                <strong>{activePatient.answers['medical_epilepsy'] === 'yes' ? 'YES (Reported)' : 'No'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cardiac Disease: </span>
                <strong>{activePatient.answers['medical_cardiac'] === 'yes' ? 'YES' : 'No'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Renal Disease: </span>
                <strong>{activePatient.answers['medical_renal'] === 'yes' ? 'YES' : 'No'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Autoimmune (SLE/RA): </span>
                <strong>{activePatient.answers['medical_autoimmune'] === 'yes' ? 'YES' : 'No'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Periodontal Gum Disease: </span>
                <strong>{activePatient.answers['medical_periodontal'] === 'yes' ? 'YES (Bleeding gums)' : 'No'}</strong>
              </div>
            </div>
          </div>

          {/* 3. Medications & Folic Acid Status */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <span>3. Medications & Folic Acid Supplementation</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(FOGSI Checklist #2, #6, E-Booklet p. 18, 23)</span>
            </h4>
            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
              <div style={{ marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Current Medications / Supplements: </span>
                <strong>{activePatient.answers['taking_medications'] === 'yes' ? (activePatient.answers['medication_names'] || 'Yes, details reported') : 'None reported'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Folic Acid Daily Intake: </span>
                {activePatient.answers['folic_acid_status'] === 'yes' ? (
                  <span style={{ color: '#166534', fontWeight: 700 }}>
                    Active ({activePatient.answers['folic_acid_dose'] === 'high_5mg' ? 'High dose 5mg' : 'Standard dose 400–800 μg'})
                  </span>
                ) : (
                  <span style={{ color: '#dc2626', fontWeight: 700 }}>
                    NOT CURRENTLY TAKING (Initiation advised &ge; 1 month prior to conception)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 4. Immunization & Infection Screening */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <span>4. Immunization & Infection History</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(FOGSI Checklist #4B, #8, E-Booklet p. 17, 24)</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.6rem', fontSize: '0.88rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Rubella (MMR): </span>
                <strong>{activePatient.answers['tested_rubella'] === 'immune_vaccinated' ? 'Immune / Vaccinated' : 'Uncertain (Screen IgG / Defer 4w)'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Varicella (Chickenpox): </span>
                <strong>{activePatient.answers['tested_varicella'] === 'had_disease_or_vaccine' ? 'History of disease / vaccine' : 'Uncertain (2-dose series)'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Hepatitis B / HIV: </span>
                <strong>{activePatient.answers['tested_hepb_hiv'] || 'Screening indicated'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tuberculosis history: </span>
                <strong>{activePatient.answers['history_tuberculosis'] === 'yes' ? 'Reported' : 'Negative'}</strong>
              </div>
            </div>
          </div>

          {/* 5. Environmental & Lifestyle Review */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <span>5. Environmental, Occupational & Lifestyle Factors (Both Partners)</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(FOGSI Checklist #4D, #4E, E-Booklet p. 19-20)</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.6rem', fontSize: '0.88rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Environmental Exposures: </span>
                <strong>{activePatient.answers['environmental_hazards'] === 'yes' ? 'Reported (Pesticides / Solvents / Heat)' : 'None reported'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tobacco (Couple): </span>
                <strong>{activePatient.answers['tobacco_use'] || 'None'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Alcohol (Preconception): </span>
                <strong>{activePatient.answers['alcohol_use'] || 'None'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Caffeine Intake: </span>
                <strong>{activePatient.answers['caffeine_intake'] || '0–1 cups'}</strong>
              </div>
            </div>
          </div>

          {/* 6. Mental Health & Psychosocial Screening */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <span>6. Mental Health & Psychosocial Safety</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(FOGSI Checklist #9, E-Booklet p. 26-28)</span>
            </h4>
            <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Depression / Anxiety Screen: </span>
                <strong>{activePatient.answers['mental_health_history'] === 'yes' ? 'Positive personal history' : 'Negative'}</strong>
              </div>
              <div style={{ marginTop: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Prior Perinatal Mood Episode: </span>
                <strong>{activePatient.answers['perinatal_mental_history'] === 'yes_experienced' ? 'YES (High predictor of recurrence)' : 'None reported'}</strong>
              </div>
              <div style={{ marginTop: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Relationship Safety & Support: </span>
                <strong>{activePatient.answers['stress_safety'] || 'Supported'}</strong>
              </div>
            </div>
          </div>

          {/* 7. Recommended Laboratory Investigations (Checklist Reference #5) */}
          <div style={{ marginBottom: '1.5rem', background: '#fdf4ff', border: '1px solid #f5d0fe', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#86198f', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <BookmarkCheck size={16} />
              <span>Recommended Preconception Laboratory Investigations (FOGSI Checklist #5)</span>
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#701a75', lineHeight: 1.5 }}>
              • Complete Blood Count (CBC) to screen & treat anaemia<br />
              • Blood group & Rh typing<br />
              • Blood glucose & HbA1c (Target &lt; 6.5%)<br />
              • Thyroid Profile (TSH euthyroid target)<br />
              • Urine routine examination & culture<br />
              • Serology: HIV, HBsAg, VDRL, Rubella IgG<br />
              • Thalassemia screening (Hb HPLC) especially with family history
            </p>
          </div>
        </div>

        {/* Doctor Consultation Notes & Sign-off Box */}
        <div className="doctor-notes-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
            <FileText size={16} color="var(--primary-600)" />
            <span>Doctor's Consultation Notes & Management Plan</span>
          </div>

          <textarea
            placeholder="Document examination findings (BP, BMI), prescription changes, lab orders, or counselling points..."
            value={doctorNotes[selectedPatientId] || ''}
            onChange={(e) => handleNotesChange(e.target.value)}
          />

          <div className="signoff-row">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={!!checklistSigned[selectedPatientId]}
                onChange={handleSignToggle}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
              />
              <span>Checklist completed and discussed with the couple (FOGSI Checklist Item #12)</span>
            </label>

            <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-sub)' }}>
              <div>Dr. Signature / Stamp: ______________________</div>
              <div style={{ marginTop: '0.25rem' }}>Date: {new Date().toLocaleDateString('en-GB')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
