import React, { useMemo } from 'react';
import { UI_TRANSLATIONS } from '../data/translations';
import { SECTIONS_META, QUESTIONS, generateClinicianFlags } from '../data/fogsiQuestions';
import { CheckCircle2, Edit3, ArrowRight, ShieldCheck, Heart, FileText, Check, X, HelpCircle, Download } from 'lucide-react';
import { formatAnswerValue } from '../utils/answerFormatter';
import confetti from 'canvas-confetti';

export default function PatientReview({
  lang,
  patient,
  answers = {},
  history = [],
  sectionNotes = {},
  onEditQuestion,
  onSubmitToDoctor
}) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  // Calculate analytics strictly from selected answers
  const analytics = useMemo(() => {
    let yes = 0;
    let no = 0;
    let not_sure = 0;
    let other = 0;

    const answeredKeys = Object.keys(answers);
    answeredKeys.forEach(k => {
      const val = answers[k];
      if (val === 'yes') yes++;
      else if (val === 'no') no++;
      else if (val === 'not_sure') not_sure++;
      else other++;
    });

    const flags = generateClinicianFlags(answers);
    const flagged = flags.filter(f => f.level === 'attention' || f.level === 'review').length;

    return {
      total: answeredKeys.length || history.length,
      yes,
      no,
      not_sure,
      other,
      flagged
    };
  }, [answers, history]);

  // Count how many sections have doctor notes
  const notesCount = useMemo(() => {
    return Object.values(sectionNotes).filter(n => n && String(n).trim().length > 0).length;
  }, [sectionNotes]);

  const handleDone = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    // Call submit handler which saves details, notes, generates JSON, and opens dashboard
    onSubmitToDoctor();
  };

  // Group recorded answers by section
  const sectionsWithAnswers = SECTIONS_META.map(sec => {
    const sectionItems = history.filter(item => {
      const qDef = QUESTIONS.find(q => q.id === item.questionId) ||
        QUESTIONS.flatMap(q => q.followUps || []).find(sub => sub.id === item.questionId);
      return qDef && qDef.section === sec.id;
    });

    return {
      ...sec,
      title: t.sections[sec.id] || sec.id,
      items: sectionItems,
      sectionNote: sectionNotes[sec.id] || null
    };
  }).filter(sec => sec.items.length > 0 || sec.sectionNote);

  return (
    <div className="review-page-container animate-fade-in">
      {/* Header */}
      <div className="view-header" style={{ marginBottom: '1.5rem' }}>
        <div className="welcome-badge" style={{ margin: '0 auto 0.75rem', display: 'inline-flex' }}>
          <CheckCircle2 size={16} color="#059669" />
          <span>Doctor-Entered Clinical Assessment</span>
        </div>
        <h2>Clinical History Review</h2>
        <p>Review the patient's verbal answers and section notes before final completion.</p>
      </div>

      {/* Analytics Preview Strip (Generated strictly from selected answers) */}
      <div className="review-analytics-summary-card">
        <div className="analytics-preview-header">
          <span className="analytics-preview-title">Doctor-Entered Assessment Summary</span>
          {patient && <span className="analytics-patient-name">{patient.name}</span>}
        </div>
        <div className="analytics-preview-tiles">
          <div className="preview-tile">
            <span className="tile-num">{analytics.total}</span>
            <span className="tile-txt">Questions Answered</span>
          </div>
          <div className="preview-tile tile-yes">
            <span className="tile-num">
              <Check size={14} strokeWidth={3} />
              {analytics.yes}
            </span>
            <span className="tile-txt">YES</span>
          </div>
          <div className="preview-tile tile-no">
            <span className="tile-num">
              <X size={14} strokeWidth={3} />
              {analytics.no}
            </span>
            <span className="tile-txt">NO</span>
          </div>
          <div className="preview-tile tile-not-sure">
            <span className="tile-num">
              <HelpCircle size={14} />
              {analytics.not_sure}
            </span>
            <span className="tile-txt">NOT SURE</span>
          </div>
          {analytics.flagged > 0 && (
            <div className="preview-tile tile-flagged">
              <span className="tile-num">{analytics.flagged}</span>
              <span className="tile-txt">Clinical Flags</span>
            </div>
          )}
          {notesCount > 0 && (
            <div className="preview-tile tile-notes">
              <span className="tile-num">{notesCount}</span>
              <span className="tile-txt">Section Notes</span>
            </div>
          )}
        </div>
      </div>

      {/* Section-by-section questions, answers and the ONE note per section */}
      {sectionsWithAnswers.map((sec) => (
        <div key={sec.id} className="review-section-block">
          <div className="review-section-header">
            <h3>
              <span style={{ color: 'var(--primary-600)' }}>🌸</span>
              <span>{sec.title}</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {sec.items.length} {sec.items.length === 1 ? 'question' : 'questions'}
            </span>
          </div>

          <div>
            {sec.items.map((item, idx) => {
              return (
                <div key={idx} className="review-item-row">
                  <div className="review-q-text">
                    <div className="review-q-title-text">{item.questionText}</div>
                  </div>
                  <div className="review-a-text">
                    <span className={`review-answer-badge val-${item.answerValue}`}>
                      {item.answerValue === 'yes' ? 'YES' :
                       item.answerValue === 'no' ? 'NO' :
                       item.answerValue === 'not_sure' ? 'NOT SURE' :
                       formatAnswerValue(item.answerValue || item.answerDisplay)}
                    </span>
                    <button
                      onClick={() => onEditQuestion(item.questionId)}
                      title={t.editAnswer}
                      className="review-edit-btn"
                      type="button"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {sec.sectionNote && (
            <div className="review-doctor-note-pill" style={{ marginTop: '0.75rem', marginInline: '0.5rem', marginBottom: '0.5rem' }}>
              <FileText size={14} color="#be123c" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Notes for {sec.title}:</strong> "{sec.sectionNote}"
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Medical Safety Disclaimer banner before final submit */}
      <div className="disclaimer-box" style={{ marginTop: '1.5rem' }}>
        <div className="disclaimer-title">
          <ShieldCheck size={16} />
          <span>FOGSI Safe Motherhood Preconception Protocol</span>
        </div>
        <p className="disclaimer-body">
          Completing this assessment compiles all selected responses, clinician flags, and question-specific notes into a permanent patient record and generates the standardized JSON data for consultation and future review.
        </p>
      </div>

      {/* FINAL PAGE — DONE BUTTON */}
      <div className="final-done-action-wrapper">
        <button
          className="btn-done-primary"
          id="btn-done-assessment"
          onClick={handleDone}
          type="button"
        >
          <CheckCircle2 size={24} />
          <span>DONE</span>
        </button>
        <div className="done-helper-caption">
          Click <strong>DONE</strong> to save all patient details, answers, and notes, generate the JSON file, and open the Dashboard.
        </div>
      </div>
    </div>
  );
}
