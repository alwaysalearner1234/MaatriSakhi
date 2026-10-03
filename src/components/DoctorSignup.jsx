import React, { useState } from "react";
import { UI_TRANSLATIONS } from "../data/translations";
import { Stethoscope, Mail, Lock, User, Eye, EyeOff, UserPlus, Sparkles } from "lucide-react";
import { doctorSignup, doctorLogin, DEMO_DOCTOR } from "../utils/doctorApi";
import "./DoctorLogin.css";

// Doctor sign-up. Creates a real account via POST /api/auth/signup when the
// backend is reachable, otherwise a local-only account on this device.
// Includes the demo credentials + one-click demo entry (works offline too).
export default function DoctorSignup({ lang, onSignupSuccess, onBackToLogin, onUseDemo }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [offlineNote, setOfflineNote] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOfflineNote(false);
    if (!name.trim()) return setError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const { doctor, offline } = await doctorSignup({ name: name.trim(), email: email.trim(), password });
      if (offline) setOfflineNote(true);
      onSignupSuccess(doctor);
    } catch (err) {
      setError(err.message || "Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const useDemo = async () => {
    setError("");
    setLoading(true);
    try {
      const { doctor } = await doctorLogin({ email: DEMO_DOCTOR.email, password: DEMO_DOCTOR.password });
      if (onUseDemo) onUseDemo(doctor);
      else onSignupSuccess(doctor);
    } catch (err) {
      setError(err.message || "Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dl-page">
      <div className="dl-card">
        <div className="dl-header">
          <div className="dl-badge">
            <Stethoscope size={26} />
          </div>
          <h2 className="dl-title">Doctor Sign Up</h2>
          <p className="dl-subtitle">Create your clinician account</p>
        </div>

        {error && (
          <div className="dl-error" role="alert">
            {error}
          </div>
        )}

        <form className="dl-form" onSubmit={handleSubmit} noValidate>
          <label className="dl-label" htmlFor="ds-name">Full name</label>
          <div className="dl-input-wrap">
            <User size={18} className="dl-input-icon" />
            <input
              id="ds-name"
              type="text"
              autoComplete="name"
              className="dl-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Anita Joshi"
            />
          </div>

          <label className="dl-label" htmlFor="ds-email">{t.email || "Email"}</label>
          <div className="dl-input-wrap">
            <Mail size={18} className="dl-input-icon" />
            <input
              id="ds-email"
              type="email"
              autoComplete="email"
              className="dl-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder || "Enter your email"}
            />
          </div>

          <label className="dl-label" htmlFor="ds-password">{t.password || "Password"} (min 6 chars)</label>
          <div className="dl-input-wrap">
            <Lock size={18} className="dl-input-icon" />
            <input
              id="ds-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="dl-input dl-input-pw"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="dl-eye"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <label className="dl-label" htmlFor="ds-confirm">Confirm password</label>
          <div className="dl-input-wrap">
            <Lock size={18} className="dl-input-icon" />
            <input
              id="ds-confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="dl-input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="dl-submit" disabled={loading}>
            {loading ? (
              <><span className="dl-spinner" /> Creating account...</>
            ) : (
              <><UserPlus size={18} /> Sign Up</>
            )}
          </button>
        </form>

        <button type="button" className="dl-demo" onClick={useDemo} disabled={loading}>
          <Sparkles size={16} /> Try demo account →
        </button>
        <p className="dl-demo-creds">
          Demo: <code>{DEMO_DOCTOR.email} / {DEMO_DOCTOR.password}</code> — works even without backend
        </p>
        {offlineNote && (
          <p className="dl-offline-note">Offline mode — account created on this device only.</p>
        )}

        <p className="dl-footer">
          Already have an account?{" "}
          <button type="button" className="dl-link" onClick={onBackToLogin}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
