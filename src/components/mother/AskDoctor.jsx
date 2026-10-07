import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircleQuestion, Send, AlertCircle, Sparkles, Share2 } from 'lucide-react';
import { topQuestionsFor } from '../../utils/askDoctor';
import { askQuestion, listQuestions, setSharing } from '../../utils/motherApi';
import './mother.css';

// "Ask your doctor": top-3 smart suggested questions (built from the mother's
// own week, limits, visit date and home readings) + a free-text query box.
// Also holds the "share my home readings with my doctor" toggle.
export default function AskDoctor({ pregnancy, entries, onSharingChanged }) {
  const suggestions = useMemo(() => topQuestionsFor(pregnancy, entries), [pregnancy, entries]);
  const [text, setText] = useState('');
  const [mine, setMine] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [sharing, setSharingState] = useState(!!pregnancy?.doctor_access_granted);
  const [shareBusy, setShareBusy] = useState(false);

  useEffect(() => {
    if (pregnancy?.id) listQuestions(pregnancy.id).then(setMine).catch(() => {});
  }, [pregnancy?.id]);

  const send = async (questionText, isSuggested) => {
    const q = (questionText ?? text).trim();
    if (!q) return;
    setErr(''); setBusy(true);
    try {
      const row = await askQuestion({ pregnancy_id: pregnancy.id, question_text: q, is_suggested: !!isSuggested });
      setMine((p) => [row, ...p]);
      setText('');
    } catch (e) {
      setErr(e.message || 'Could not send. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const toggleSharing = async () => {
    setShareBusy(true);
    try {
      await setSharing(pregnancy.id, !sharing);
      setSharingState(!sharing);
      if (onSharingChanged) onSharingChanged(!sharing);
    } catch (e) {
      setErr(e.message || 'Could not update sharing.');
    } finally {
      setShareBusy(false);
    }
  };

  return (
    <section className="tracker">
      <h3><MessageCircleQuestion size={18} /> Ask your doctor <em>top 3 for your next visit</em></h3>

      <div className="suggest-grid">
        {suggestions.map((s) => (
          <button key={s.key} type="button" className="suggest-card" onClick={() => send(s.text, true)} disabled={busy}>
            <span className="suggest-text">“{s.text}”</span>
            <span className="suggest-reason"><Sparkles size={12} /> {s.reason} — tap to ask</span>
          </button>
        ))}
      </div>

      <div className="setup-inputrow">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Or type your own question for the doctor…"
          className="mother-textinput"
        />
        <button type="button" className="btn-primary-lg" onClick={() => send()} disabled={busy || !text.trim()}>
          <Send size={15} /> Ask
        </button>
      </div>
      {err && <div className="mother-error"><AlertCircle size={15} /> {err}</div>}

      {mine.length > 0 && (
        <ul className="tracker-list">
          {mine.map((q) => (
            <li key={q.id}>“{q.question_text}”{q.is_suggested ? ' (suggested)' : ''} — {new Date(q.created_at).toLocaleDateString()}</li>
          ))}
        </ul>
      )}

      <div className="share-row">
        <Share2 size={16} />
        <span>Share my home BP/sugar readings with my doctor</span>
        <button
          type="button"
          className={`share-toggle ${sharing ? 'on' : ''}`}
          onClick={toggleSharing}
          disabled={shareBusy}
          aria-pressed={sharing}
        >
          {sharing ? 'Shared ✓' : 'Share'}
        </button>
      </div>
      {sharing && <p className="mother-note">Your doctor can now see your home readings and open questions in their dashboard.</p>}
    </section>
  );
}
