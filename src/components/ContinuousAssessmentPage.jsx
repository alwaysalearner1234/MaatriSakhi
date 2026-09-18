import React, { useState, useMemo, useEffect } from 'react';
import { SECTIONS_META, QUESTIONS, generateClinicianFlags } from '../data/fogsiQuestions';
import { UI_TRANSLATIONS, LANGUAGES } from '../data/translations';
import { formatAnswerValue } from '../utils/answerFormatter';
import {
  Check,
  X,
  HelpCircle,
  Save,
  CheckCircle2,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  User,
  Heart,
  Baby,
  Activity,
  Scissors,
  Pill,
  Dna,
  Trees,
  Coffee,
  Smile,
  Apple,
  HeartHandshake,
  FileText,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const SECTION_ICONS = {
  intention: HeartHandshake,
  marital: Heart,
  obstetric: Baby,
  medical: Activity,
  surgical: Scissors,
  medications: Pill,
  family: Dna,
  infections: ShieldCheck,
  environment: Trees,
  lifestyle: Coffee,
  mental: Smile,
  nutrition: Apple
};

export default function ContinuousAssessmentPage({
  patient,
  answers = {},
  sectionNotes = {},
  lang = 'en',
  onAnswer,
  onSectionNoteChange,
  onSaveDraft,
  onCompleteAssessment,
  onBackToDashboard
}) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const currentLangObj = LANGUAGES.find(l => l.id === lang) || LANGUAGES[0];

  const [activeSectionId, setActiveSectionId] = useState('patient-details');
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  // Patient demographic details state
  const [patientDetails, setPatientDetails] = useState({
    name: patient?.name || 'Walk-In Patient',
    age: patient?.age || 28,
    phone: patient?.phone || '',
    address: patient?.address || patient?.city || 'Local Clinic Visit',
    doctorDescription: patient?.doctorDescription || 'Standard preconception clinical assessment.'
  });

  useEffect(() => {
    if (patient) {
      setPatientDetails({
        name: patient.name || 'Walk-In Patient',
        age: patient.age || 28,
        phone: patient.phone || '',
        address: patient.address || patient.city || 'Local Clinic Visit',
        doctorDescription: patient.doctorDescription || 'Standard preconception clinical assessment.'
      });
    }
  }, [patient]);

  // Group questions by section
  const sectionQuestionsMap = useMemo(() => {
    const map = {};
    SECTIONS_META.forEach(sec => {
      map[sec.id] = QUESTIONS.filter(q => q.section === sec.id);
    });
    return map;
  }, []);

  // Calculate answered count and breakdown
  const stats = useMemo(() => {
    let yes = 0;
    let no = 0;
    let notSure = 0;
    let other = 0;

    Object.values(answers).forEach(val => {
      if (val === 'yes') yes++;
      else if (val === 'no') no++;
      else if (val === 'not_sure') notSure++;
      else if (val !== undefined && val !== null) other++;
    });

    const totalAnswered = yes + no + notSure + other;
    return { totalAnswered, yes, no, notSure, other };
  }, [answers]);

  // Smooth scroll to target section
  const scrollToSection = (secId) => {
    setActiveSectionId(secId);
    const elem = document.getElementById(secId);
    if (elem) {
      const navOffset = 100;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleDraftClick = () => {
    if (onSaveDraft) {
      onSaveDraft();
      setDraftSavedToast(true);
      setTimeout(() => setDraftSavedToast(false), 3000);
    }
  };

  // Helper to render answer controls for any question (main or follow-up)
  const renderAnswerControls = (q) => {
    const currentVal = answers[q.id];

    if (q.type === 'yes_no_unknown') {
      return (
        <div className="continuous-btn-group">
          <button
            type="button"
            className={`btn-cont-choice btn-yes ${currentVal === 'yes' ? 'selected' : ''}`}
            onClick={() => onAnswer(q.id, 'yes', q.question[lang] || q.question.en, q.section)}
          >
            <Check size={16} strokeWidth={currentVal === 'yes' ? 3 : 2} />
            <span>YES</span>
          </button>

          <button
            type="button"
            className={`btn-cont-choice btn-no ${currentVal === 'no' ? 'selected' : ''}`}
            onClick={() => onAnswer(q.id, 'no', q.question[lang] || q.question.en, q.section)}
          >
            <X size={16} strokeWidth={currentVal === 'no' ? 3 : 2} />
            <span>NO</span>
          </button>

          <button
            type="button"
            className={`btn-cont-choice btn-not-sure ${currentVal === 'not_sure' ? 'selected' : ''}`}
            onClick={() => onAnswer(q.id, 'not_sure', q.question[lang] || q.question.en, q.section)}
          >
            <HelpCircle size={15} />
            <span>NOT SURE</span>
          </button>
        </div>
      );
    }

    if (q.type === 'yes_no') {
      return (
        <div className="continuous-btn-group">
          <button
            type="button"
            className={`btn-cont-choice btn-yes ${currentVal === 'yes' ? 'selected' : ''}`}
            onClick={() => onAnswer(q.id, 'yes', q.question[lang] || q.question.en, q.section)}
          >
            <Check size={16} strokeWidth={currentVal === 'yes' ? 3 : 2} />
            <span>YES</span>
          </button>

          <button
            type="button"
            className={`btn-cont-choice btn-no ${currentVal === 'no' ? 'selected' : ''}`}
            onClick={() => onAnswer(q.id, 'no', q.question[lang] || q.question.en, q.section)}
          >
            <X size={16} strokeWidth={currentVal === 'no' ? 3 : 2} />
            <span>NO</span>
          </button>
        </div>
      );
    }

    if (q.type === 'choice' && q.options) {
      return (
        <div className="continuous-options-grid">
          {q.options.map(opt => {
            const optLabel = opt.label[lang] || opt.label.en;
            const isSel = currentVal === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`btn-cont-option ${isSel ? 'selected' : ''}`}
                onClick={() => onAnswer(q.id, opt.value, q.question[lang] || q.question.en, q.section)}
              >
                <span>{optLabel}</span>
                {isSel && <Check size={14} strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      );
    }

    if (q.type === 'multi_select' && q.options) {
      const selectedList = Array.isArray(currentVal) ? currentVal : [];
      const handleToggle = (optVal) => {
        let updated;
        if (selectedList.includes(optVal)) {
          updated = selectedList.filter(v => v !== optVal);
        } else {
          updated = [...selectedList, optVal];
        }
        onAnswer(q.id, updated, q.question[lang] || q.question.en, q.section);
      };

      return (
        <div className="continuous-options-grid">
          {q.options.map(opt => {
            const optLabel = opt.label[lang] || opt.label.en;
            const isSel = selectedList.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className={`btn-cont-option ${isSel ? 'selected' : ''}`}
                onClick={() => handleToggle(opt.value)}
              >
                <span>{optLabel}</span>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: isSel ? '2px solid var(--primary-600)' : '2px solid #cbd5e1',
                  background: isSel ? 'var(--primary-600)' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {isSel && <Check size={12} strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      );
    }

    // Free text input fallback
    return (
      <div style={{ marginTop: '0.4rem' }}>
        <input
          type="text"
          className="section-notes-input"
          placeholder="Enter patient details..."
          value={currentVal || ''}
          onChange={(e) => onAnswer(q.id, e.target.value, q.question[lang] || q.question.en, q.section)}
        />
      </div>
    );
  };

  return (
    <div className="continuous-assessment-root animate-fade-in">
      {/* ==================================================
          1. STICKY SECTION NAVIGATION BAR
          ================================================== */}
      <div className="sticky-assessment-nav">
        <div className="assessment-nav-top-row">
          <div className="nav-left-meta">
            <button
              type="button"
              className="btn-back-clean"
              onClick={onBackToDashboard}
              title="Return to Doctor Dashboard"
            >
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </button>

            <div className="patient-nav-chip">
              <span className="chip-name">{patient?.name || 'Walk-In Patient'}</span>
              <span className="chip-age">{patient?.age ? `${patient.age} yrs` : '28 yrs'}</span>
              <span className="chip-protocol">FOGSI Preconception Assessment</span>
            </div>
          </div>

          <div className="nav-right-actions">
            <div className="assessment-live-counter">
              <span className="count-badge">{stats.totalAnswered} Answered</span>
              <span className="count-sub">YES: {stats.yes} • NO: {stats.no} • NOT SURE: {stats.notSure}</span>
            </div>

            <button
              type="button"
              className="btn-save-draft"
              onClick={handleDraftClick}
              title="Save current answers and notes to resume later"
            >
              <Save size={15} />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              className="btn-complete-nav"
              onClick={() => onCompleteAssessment && onCompleteAssessment(patientDetails)}
              id="btn-nav-submit-assessment"
            >
              <CheckCircle2 size={16} />
              <span>SUBMIT ASSESSMENT</span>
            </button>
          </div>
        </div>

        {/* Horizontal scrollable section pills */}
        <div className="assessment-section-tabs-row">
          <button
            type="button"
            className={`sec-nav-pill ${activeSectionId === 'patient-details' ? 'active' : ''}`}
            onClick={() => scrollToSection('patient-details')}
          >
            <User size={13} />
            <span>Patient Details</span>
          </button>

          {SECTIONS_META.map((sec) => {
            const IconComponent = SECTION_ICONS[sec.id] || FileText;
            const secTitle = t.sections[sec.id] || sec.id;
            const secQuestions = sectionQuestionsMap[sec.id] || [];
            const answeredInSec = secQuestions.filter(q => answers[q.id] !== undefined).length;
            const hasNote = Boolean(sectionNotes[sec.id]?.trim());

            return (
              <button
                key={sec.id}
                type="button"
                className={`sec-nav-pill ${activeSectionId === `sec-${sec.id}` ? 'active' : ''}`}
                onClick={() => scrollToSection(`sec-${sec.id}`)}
              >
                <IconComponent size={13} />
                <span>{secTitle}</span>
                {answeredInSec > 0 && (
                  <span className="sec-pill-count">{answeredInSec}</span>
                )}
                {hasNote && <span className="sec-pill-note-dot" title="Section note added">•</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Draft Saved Toast Notification */}
      {draftSavedToast && (
        <div className="draft-saved-toast animate-fade-in">
          <CheckCircle2 size={16} color="#166534" />
          <span>Draft successfully saved. You can resume anytime from the Doctor Dashboard.</span>
        </div>
      )}

      {/* ==================================================
          2. CONTINUOUS ASSESSMENT BODY
          ================================================== */}
      <div className="continuous-assessment-body">
        {/* Banner Notice */}
        <div className="clinician-instruction-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <ShieldCheck size={18} color="#be123c" />
            <strong style={{ color: '#be123c', fontSize: '0.92rem' }}>
              Doctor-Led Verbal Consultation • FOGSI Safe Motherhood Protocol
            </strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#4c0519', lineHeight: 1.45 }}>
            Ask each question to the patient verbally and record their answer below. Enter section-level clinical notes at the end of each section. Click <strong>Complete Assessment</strong> at the bottom when finished.
          </p>
        </div>

        {/* ──────────────────────────────────────────────────
            CARD 1: PATIENT DETAILS
            ────────────────────────────────────────────────── */}
        <section className="continuous-section-card" id="patient-details">
          <div className="section-card-header">
            <div className="section-title-wrap">
              <div className="section-icon-badge">
                <User size={20} color="#be123c" />
              </div>
              <div>
                <h2 className="section-heading">PATIENT DETAILS</h2>
                <div className="section-subtext">Clinical Registration & Preconception Demographics</div>
              </div>
            </div>
            <span className="section-status-tag">Registered</span>
          </div>

          <div className="patient-details-grid">
            <div className="pt-detail-item">
              <span className="pt-detail-label">Full Patient Name</span>
              <input
                type="text"
                className="pt-detail-input"
                value={patientDetails.name}
                onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                placeholder="Patient Full Name"
                style={{ width: '100%', padding: '0.45rem 0.65rem', border: '1.5px solid #cbd5e1', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.92rem', background: '#ffffff' }}
              />
            </div>
            <div className="pt-detail-item">
              <span className="pt-detail-label">Age</span>
              <input
                type="number"
                className="pt-detail-input"
                value={patientDetails.age}
                onChange={(e) => setPatientDetails({ ...patientDetails, age: e.target.value })}
                placeholder="Age in years"
                style={{ width: '100%', padding: '0.45rem 0.65rem', border: '1.5px solid #cbd5e1', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.92rem', background: '#ffffff' }}
              />
            </div>
            <div className="pt-detail-item">
              <span className="pt-detail-label">Phone Contact</span>
              <input
                type="tel"
                className="pt-detail-input"
                value={patientDetails.phone}
                onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                placeholder="+91 98000 00000"
                style={{ width: '100%', padding: '0.45rem 0.65rem', border: '1.5px solid #cbd5e1', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.92rem', background: '#ffffff' }}
              />
            </div>
            <div className="pt-detail-item">
              <span className="pt-detail-label">Residential Address / City</span>
              <input
                type="text"
                className="pt-detail-input"
                value={patientDetails.address}
                onChange={(e) => setPatientDetails({ ...patientDetails, address: e.target.value })}
                placeholder="City / Address"
                style={{ width: '100%', padding: '0.45rem 0.65rem', border: '1.5px solid #cbd5e1', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.92rem', background: '#ffffff' }}
              />
            </div>
            <div className="pt-detail-item pt-full-width">
              <span className="pt-detail-label">Doctor's Initial Clinical Description / Background</span>
              <textarea
                className="pt-detail-textarea"
                rows={2}
                value={patientDetails.doctorDescription}
                onChange={(e) => setPatientDetails({ ...patientDetails, doctorDescription: e.target.value })}
                placeholder="Clinical background, reasons for visit, or referral notes..."
                style={{ width: '100%', padding: '0.45rem 0.65rem', border: '1.5px solid #cbd5e1', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', resize: 'vertical', background: '#ffffff' }}
              />
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────
            CARDS 2+: ALL ASSESSMENT SECTIONS IN SEQUENCE
            ────────────────────────────────────────────────── */}
        {SECTIONS_META.map((sec, secIdx) => {
          const IconComponent = SECTION_ICONS[sec.id] || FileText;
          const secTitle = t.sections[sec.id] || sec.id;
          const questions = sectionQuestionsMap[sec.id] || [];

          return (
            <section key={sec.id} className="continuous-section-card" id={`sec-${sec.id}`}>
              {/* Section Header */}
              <div className="section-card-header">
                <div className="section-title-wrap">
                  <div className="section-icon-badge">
                    <IconComponent size={20} color="#be123c" />
                  </div>
                  <div>
                    <h2 className="section-heading">
                      {secTitle.toUpperCase()}
                    </h2>
                    <div className="section-subtext">
                      Section {secIdx + 1} of {SECTIONS_META.length} • {questions.length} Questions
                    </div>
                  </div>
                </div>

                {/* Counter of answered in section */}
                <div className="section-answered-counter">
                  {questions.filter(q => answers[q.id] !== undefined).length} / {questions.length} answered
                </div>
              </div>

              {/* Questions List for this section */}
              <div className="section-questions-list">
                {questions.map((q, qIdx) => {
                  const qText = q.question[lang] || q.question.en;
                  const currentVal = answers[q.id];
                  const hasAnswer = currentVal !== undefined;

                  // Check smart follow-ups
                  const shouldShowFollowUps = q.followUps && q.followUps.length > 0 &&
                    (q.followUpIf ? currentVal === q.followUpIf : hasAnswer);

                  return (
                    <div
                      key={q.id}
                      className={`continuous-question-row ${hasAnswer ? 'answered' : ''}`}
                    >
                      <div className="question-text-col">
                        <div className="question-number-line">
                          <span className="q-num-badge">{qIdx + 1}</span>
                          <span className="q-title-text">{qText}</span>
                        </div>
                        {q.source && (
                          <div className="q-source-tag">
                            <ShieldCheck size={12} color="#059669" />
                            <span>{q.source}</span>
                          </div>
                        )}
                      </div>

                      <div className="question-controls-col">
                        {renderAnswerControls(q)}
                      </div>

                      {/* SMART DISPLAY: Conditional Follow-Up Questions */}
                      {shouldShowFollowUps && (
                        <div className="conditional-followups-container animate-fade-in">
                          <div className="followups-intro-header">
                            <Sparkles size={14} color="#e11d48" />
                            <span>Clinical Follow-Up Details:</span>
                          </div>

                          {q.followUps.map((subQ, subIdx) => {
                            const subQText = subQ.question[lang] || subQ.question.en;
                            return (
                              <div key={subQ.id} className="followup-subquestion-item">
                                <div className="subquestion-text">
                                  <strong>{subIdx + 1}.</strong> {subQText}
                                </div>
                                <div className="subquestion-controls">
                                  {renderAnswerControls(subQ)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* EXACTLY ONE Notes field for the entire section */}
              <div className="section-notes-dock">
                <div className="section-notes-header">
                  <label htmlFor={`notes-input-${sec.id}`} className="section-notes-label">
                    Notes:
                  </label>
                  <span className="section-notes-hint">
                    (Doctor's clinical notes for {secTitle} — optional)
                  </span>
                  {sectionNotes[sec.id]?.trim() && (
                    <span className="section-notes-saved-tag">✓ Note saved</span>
                  )}
                </div>

                <textarea
                  id={`notes-input-${sec.id}`}
                  rows={2}
                  className="section-notes-textarea"
                  placeholder={`Enter doctor's clinical observations for ${secTitle}...`}
                  value={sectionNotes[sec.id] || ''}
                  onChange={(e) => onSectionNoteChange(sec.id, e.target.value)}
                />
              </div>
            </section>
          );
        })}

        {/* ──────────────────────────────────────────────────
            BOTTOM ACTION PANEL: SAVE DRAFT & COMPLETE ASSESSMENT
            ────────────────────────────────────────────────── */}
        <div className="continuous-bottom-summary-panel">
          <div className="summary-tiles-row">
            <div className="summary-stat-tile">
              <span className="stat-num">{stats.totalAnswered}</span>
              <span className="stat-lbl">Questions Answered</span>
            </div>
            <div className="summary-stat-tile stat-yes">
              <span className="stat-num">
                <Check size={16} strokeWidth={3} /> {stats.yes}
              </span>
              <span className="stat-lbl">YES</span>
            </div>
            <div className="summary-stat-tile stat-no">
              <span className="stat-num">
                <X size={16} strokeWidth={3} /> {stats.no}
              </span>
              <span className="stat-lbl">NO</span>
            </div>
            <div className="summary-stat-tile stat-not-sure">
              <span className="stat-num">
                <HelpCircle size={15} /> {stats.notSure}
              </span>
              <span className="stat-lbl">NOT SURE</span>
            </div>
            <div className="summary-stat-tile stat-notes">
              <span className="stat-num">
                {Object.values(sectionNotes).filter(n => n?.trim()).length}
              </span>
              <span className="stat-lbl">Section Notes</span>
            </div>
          </div>

          <div className="bottom-buttons-action-row">
            <button
              type="button"
              className="btn-save-draft-large"
              onClick={handleDraftClick}
            >
              <Save size={18} />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              className="btn-complete-large"
              onClick={() => onCompleteAssessment && onCompleteAssessment(patientDetails)}
              id="btn-bottom-submit-assessment"
            >
              <CheckCircle2 size={22} />
              <span>SUBMIT ASSESSMENT</span>
            </button>
          </div>

          <div className="bottom-compliance-disclaimer">
            <ShieldCheck size={14} color="#059669" />
            <span>
              Clicking <strong>SUBMIT ASSESSMENT</strong> immediately saves patient details, verbal answers, section-level notes, generates structured assessment JSON, calculates analytics, and opens the Doctor Dashboard.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
