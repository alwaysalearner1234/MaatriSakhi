import React from 'react';
import { UI_TRANSLATIONS } from '../data/translations';
import { SECTIONS_META, QUESTIONS } from '../data/fogsiQuestions';
import { CheckCircle2, Edit3, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PatientReview({
  lang,
  answers,
  history,
  onEditQuestion,
  onSubmitToDoctor
}) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  const handleSubmit = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    onSubmitToDoctor();
  };

  // Group recorded answers by section
  const sectionsWithAnswers = SECTIONS_META.map(sec => {
    // Find all questions in this section that were answered in history
    const sectionItems = history.filter(item => {
      // Find question definition
      const qDef = QUESTIONS.find(q => q.id === item.questionId) ||
        QUESTIONS.flatMap(q => q.followUps || []).find(sub => sub.id === item.questionId);
      return qDef && qDef.section === sec.id;
    });

    return {
      ...sec,
      title: t.sections[sec.id] || sec.id,
      items: sectionItems
    };
  }).filter(sec => sec.items.length > 0);

  return (
    <div className="review-page-container animate-fade-in">
      <div className="view-header" style={{ marginBottom: '1.5rem' }}>
        <div className="welcome-badge" style={{ margin: '0 auto 0.75rem', display: 'inline-flex' }}>
          <CheckCircle2 size={16} color="#059669" />
          <span>{t.answersRecorded}</span>
        </div>
        <h2>{t.reviewTitle}</h2>
        <p>{t.reviewSubtitle}</p>
      </div>

      {sectionsWithAnswers.map((sec) => (
        <div key={sec.id} className="review-section-block">
          <div className="review-section-header">
            <h3>
              <span style={{ color: 'var(--primary-600)' }}>🌸</span>
              <span>{sec.title}</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {sec.items.length} {sec.items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div>
            {sec.items.map((item, idx) => (
              <div key={idx} className="review-item-row">
                <div className="review-q-text">
                  {item.questionText}
                </div>
                <div className="review-a-text">
                  <span>{item.answerDisplay}</span>
                  <button
                    onClick={() => onEditQuestion(item.questionId)}
                    title={t.editAnswer}
                    style={{
                      color: 'var(--primary-600)',
                      padding: '0.25rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'var(--primary-50)',
                      borderRadius: '6px'
                    }}
                    type="button"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Medical Safety Disclaimer banner before final submit */}
      <div className="disclaimer-box" style={{ marginTop: '1.5rem' }}>
        <div className="disclaimer-title">
          <ShieldCheck size={16} />
          <span>FOGSI Preconception Safety Protocol</span>
        </div>
        <p className="disclaimer-body">
          Your answers will be compiled directly into a structured Pre-Visit Summary for your obstetrician / gynaecologist. This ensures your doctor is immediately informed about critical aspects like folic acid, chronic conditions, and vaccinations.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button
          className="btn-primary-lg"
          style={{ margin: '0 auto', width: '100%', maxWidth: '400px' }}
          onClick={handleSubmit}
          type="button"
        >
          <span>{t.submitToDoctor}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
