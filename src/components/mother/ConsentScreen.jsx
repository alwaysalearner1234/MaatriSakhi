import React, { useState } from 'react';
import { ShieldCheck, Eye, RotateCcw, AlertCircle } from 'lucide-react';
import { saveConsent } from '../../utils/motherApi';
import './mother.css';

// Shown IMMEDIATELY after Mother signup, BEFORE any health data is collected.
// Backend saves consent_given (bool) + consent_at (timestamp) to Mother table.
export default function ConsentScreen({ mother, onConsented }) {
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError('');
    if (!checked) return setError('Please tick the consent checkbox to continue.');
    setBusy(true);
    try {
      const res = await saveConsent(true);
      onConsented({ ...mother, consent_given: true, consent_at: res.consent_at || new Date().toISOString() });
    } catch (e) {
      setError(e.message || 'Could not save consent. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mother-wrap animate-fade-in">
      <div className="mother-card">
        <div className="consent-badge"><ShieldCheck size={18} /> Your privacy comes first</div>
        <h2 className="mother-title">Before we begin — your consent</h2>
        <p className="mother-sub">Hi {mother?.name || 'there'} 👋. No health questions until you agree below.</p>

        <div className="consent-box">
          <h3>📋 What data is collected</h3>
          <ul>
            <li>Pregnancy profile: current week, next visit date, BP / diabetes history, doctor's safety limits.</li>
            <li>Tracker readings you enter: blood pressure, blood sugar (+ optional notes).</li>
            <li>Visit dates you add for reminders.</li>
          </ul>
          <h3><Eye size={14} /> Who can see it</h3>
          <ul>
            <li><strong>You</strong> — full access to your own data.</li>
            <li><strong>Your doctor</strong> — only what you choose to share / with granted access.</li>
            <li>Nobody else. No ads, no sale of data.</li>
          </ul>
          <h3><RotateCcw size={14} /> Revoke anytime</h3>
          <p>You can revoke access at any time from your dashboard — tracking pauses and your data stays yours. Revoking never affects care you already received.</p>
        </div>

        <label className="consent-check">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          <span>I understand what is collected, who can see it, and that I can revoke access at any time.</span>
        </label>
        {error && <div className="mother-error"><AlertCircle size={15} /> {error}</div>}

        <button type="button" className="btn-primary-lg" onClick={submit} disabled={busy} style={{ justifyContent: 'center' }}>
          {busy ? 'Saving…' : 'I consent — continue'}
        </button>
      </div>
    </div>
  );
}
