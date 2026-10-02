import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, Baby } from 'lucide-react';
import { CHILD_QUESTIONS, toChildPayload } from './childQuestions';
import { createChild } from '../../utils/motherApi';
import './mother.css';

// One-question-at-a-time birth-details flow (same pattern as PregnancySetupFlow).
// pregnancy prop supplies the pregnancy_id the card is permanently tagged to.
export default function ChildSetupFlow({ pregnancy, onDone, onBack }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const q = CHILD_QUESTIONS[index];
  const progress = Math.round(((index + 1) / CHILD_QUESTIONS.length) * 100);
  if (!q) return null;

  const commit = (value) => {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    setError('');
    setInput('');
    if (index + 1 < CHILD_QUESTIONS.length) setIndex(index + 1);
    else finish(next);
  };

  const finish = async (final) => {
    setBusy(true);
    try {
      const child = await createChild(toChildPayload(final, pregnancy.id));
      onDone(child);
    } catch (e) {
      setError(e.message || 'Could not save. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const submitInput = () => {
    const v = input.trim();
    if (q.required && !v) return setError('Please answer to continue (or press Skip for optional steps).');
    if (q.kind === 'number' && v) {
      const n = Number(v);
      if (Number.isNaN(n) || (q.min != null && n < q.min) || (q.max != null && n > q.max)) {
        return setError(`Enter a number between ${q.min} and ${q.max}.`);
      }
    }
    commit(v);
  };

  return (
    <div className="mother-wrap animate-fade-in">
      <div className="mother-card">
        <div className="consent-badge"><Baby size={15} /> Child Health Card — tagged to this pregnancy</div>
        <div className="setup-progress" style={{ marginTop: '.7rem' }}>
          <span>Birth details — question {index + 1} of {CHILD_QUESTIONS.length}</span>
          <strong>{progress}%</strong>
        </div>
        <div className="setup-track"><div className="setup-fill" style={{ width: `${Math.max(8, progress)}%` }} /></div>

        <h2 className="mother-title" style={{ marginTop: '1rem' }}>{q.title}</h2>
        {q.hint && <p className="mother-sub">{q.hint}</p>}

        {q.kind === 'choice' && (
          <div className="setup-yesno">
            {q.options.map((opt) => (
              <button key={opt} type="button" className="btn-cont-option" onClick={() => commit(opt)}>
                <span style={{ textTransform: 'capitalize' }}>{opt.replace('_', ' ')}</span>
              </button>
            ))}
          </div>
        )}

        {(q.kind === 'text' || q.kind === 'number' || q.kind === 'date') && (
          <div className="setup-inputrow">
            <input
              type={q.kind === 'date' ? 'date' : q.kind === 'number' ? 'number' : 'text'}
              value={input} min={q.min} max={q.max} step={q.step}
              placeholder={q.placeholder || ''}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitInput()}
              className="mother-textinput"
            />
            <button type="button" className="btn-primary-lg" onClick={submitInput} disabled={busy}>
              <span>Next</span><ArrowRight size={16} />
            </button>
          </div>
        )}

        {error && <div className="mother-error"><AlertCircle size={15} /> {error}</div>}

        <div className="setup-foot">
          <button type="button" className="mother-link" onClick={() => (index === 0 ? onBack() : (setIndex(index - 1), setInput(''), setError('')))}>
            <ArrowLeft size={14} /> Back
          </button>
          {!q.required && <button type="button" className="mother-link" onClick={() => commit('')}>Skip</button>}
        </div>
        {busy && <p className="mother-note">Creating the Child Health Card…</p>}
      </div>
    </div>
  );
}
