import React, { useMemo, useState } from 'react';
import { Check, X, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { visiblePregnancyQuestions, toPregnancyPayload } from './pregnancyQuestions';
import { createPregnancy } from '../../utils/motherApi';
import './mother.css';

// Reuses the existing "one-question-at-a-time" UX pattern:
// one card, progress bar, YES/NO big buttons, Back/Skip — like ChatInterface.
export default function PregnancySetupFlow({ onDone, onBack }) {
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const questions = useMemo(() => visiblePregnancyQuestions(answers), [answers]);
  const q = questions[index];
  const progress = questions.length ? Math.round(((index + 1) / questions.length) * 100) : 0;

  if (!q) return null;

  const commit = (id, value) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    setError('');
    setInput('');
    const visible = visiblePregnancyQuestions(next);
    if (index + 1 < visible.length) setIndex(index + 1);
    else finish(next);
  };

  const finish = async (finalAnswers) => {
    setBusy(true);
    try {
      const pregnancy = await createPregnancy(toPregnancyPayload(finalAnswers));
      onDone(pregnancy);
    } catch (e) {
      setError(e.message || 'Could not save. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const submitInput = () => {
    const v = input.trim();
    if (q.required && !v) return setError('Please answer to continue (or press Skip).');
    if (q.kind === 'number' && v) {
      const n = Number(v);
      if (Number.isNaN(n) || (q.min != null && n < q.min) || (q.max != null && n > q.max)) {
        return setError(`Enter a number between ${q.min ?? '…'} and ${q.max ?? '…'}.`);
      }
    }
    commit(q.id, v);
  };

  const goBack = () => {
    if (index === 0) return onBack();
    // remove last answered visible question so conditional steps stay consistent
    const prev = questions[index - 1];
    const next = { ...answers };
    delete next[prev.id];
    setAnswers(next);
    setInput('');
    setError('');
    setIndex(index - 1);
  };

  return (
    <div className="mother-wrap animate-fade-in">
      <div className="mother-card">
        <div className="setup-progress">
          <span>Pregnancy profile — question {index + 1} of {questions.length}</span>
          <strong>{progress}%</strong>
        </div>
        <div className="setup-track"><div className="setup-fill" style={{ width: `${Math.max(8, progress)}%` }} /></div>

        <h2 className="mother-title" style={{ marginTop: '1rem' }}>{q.title}</h2>
        {q.hint && <p className="mother-sub">{q.hint}</p>}

        {q.kind === 'yes_no' && (
          <div className="setup-yesno">
            <button type="button" className="btn-yes-huge" onClick={() => commit(q.id, 'yes')}><Check size={20} strokeWidth={3} /><span>YES</span></button>
            <button type="button" className="btn-no-huge" onClick={() => commit(q.id, 'no')}><X size={20} strokeWidth={3} /><span>NO</span></button>
          </div>
        )}

        {(q.kind === 'number' || q.kind === 'date') && (
          <div className="setup-inputrow">
            <input
              type={q.kind === 'date' ? 'date' : 'number'}
              value={input}
              min={q.min} max={q.max}
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
          <button type="button" className="mother-link" onClick={goBack}><ArrowLeft size={14} /> Back</button>
          {!q.required && <button type="button" className="mother-link" onClick={() => commit(q.id, '')}>Skip</button>}
        </div>
        {busy && <p className="mother-note">Saving your pregnancy profile…</p>}
      </div>
    </div>
  );
}
