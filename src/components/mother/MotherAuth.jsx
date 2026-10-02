import React, { useState } from 'react';
import { Mail, Lock, User, LogIn, UserPlus, AlertCircle, Play } from 'lucide-react';
import { motherSignup, motherLogin, demoMotherLogin, DEMO_MOTHER } from '../../utils/motherApi';
import './mother.css';

// Simple, secure Mother signup/login. Passwords are hashed server-side (bcrypt);
// the browser never stores the password — only a JWT (or nothing in offline demo mode).
export default function MotherAuth({ onAuthed, onBack }) {
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const demoLogin = async () => {
    setError('');
    setBusy(true);
    try {
      const data = await demoMotherLogin();
      onAuthed(data.mother);
    } catch (err) {
      setError(err.message || 'Demo login failed. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && !form.name.trim()) return setError('Please enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Please enter a valid email.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setBusy(true);
    try {
      const data =
        mode === 'signup'
          ? await motherSignup({ name: form.name.trim(), email: form.email.trim(), password: form.password })
          : await motherLogin({ email: form.email.trim(), password: form.password });
      onAuthed(data.mother);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mother-wrap animate-fade-in">
      <div className="mother-card">
        <button type="button" className="mother-link" onClick={onBack}>← Back to home</button>
        <h2 className="mother-title">{mode === 'signup' ? 'Create your Mother account' : 'Welcome back'}</h2>
        <p className="mother-sub">Secure sign-up / login for the <strong>Mother</strong> role. Your password is hashed (bcrypt) and never stored in plain text.</p>

        <div className="mother-tabs">
          <button type="button" className={`mother-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>
            <UserPlus size={15} /> Sign up
          </button>
          <button type="button" className={`mother-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
            <LogIn size={15} /> Login
          </button>
        </div>

        <form onSubmit={submit} className="mother-form">
          {mode === 'signup' && (
            <label className="mother-field">
              <span><User size={14} /> Full name</span>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Ananya Sharma" autoComplete="name" />
            </label>
          )}
          <label className="mother-field">
            <span><Mail size={14} /> Email</span>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </label>
          <label className="mother-field">
            <span><Lock size={14} /> Password (min 6 chars)</span>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="••••••••" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
          </label>
          {error && <div className="mother-error"><AlertCircle size={15} /> {error}</div>}
          <button type="submit" className="btn-primary-lg" disabled={busy} style={{ justifyContent: 'center' }}>
            {busy ? 'Please wait…' : mode === 'signup' ? 'Sign up securely' : 'Login securely'}
          </button>
        </form>
        <div className="demo-box">
          <span>Just exploring? One click logs you in with the demo account:</span>
          <code>{DEMO_MOTHER.email} / {DEMO_MOTHER.password}</code>
          <button type="button" className="demo-btn" onClick={demoLogin} disabled={busy}>
            <Play size={14} /> {busy ? 'Logging in…' : 'Try demo account →'}
          </button>
        </div>
        <p className="mother-note">Postgres-backed (Render / Supabase). Works offline in demo mode when no API is configured.</p>
      </div>
    </div>
  );
}
