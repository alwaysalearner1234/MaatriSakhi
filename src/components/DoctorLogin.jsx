import React, { useState, useEffect } from "react";
import { UI_TRANSLATIONS } from "../data/translations";
import { Stethoscope, Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import { doctorLogin, validateDoctorToken, DEMO_DOCTOR } from "../utils/doctorApi";
import "./DoctorLogin.css";

// Doctor login with offline-capable demo account:
// doctor@maatri.sakhi / doctor123 works WITH backend (seeded) and WITHOUT
// (local demo mode). Supports both prop styles: onNavigate(view) OR
// onLoginSuccess(info) / onBackToHome() / onSignup().
export default function DoctorLogin({ lang, onSelectLanguage, onNavigate, onLoginSuccess, onBackToHome, onSignup }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [offlineNote, setOfflineNote] = useState(false);

  // Route to the dashboard through whichever callback the parent provided.
  const goDoctor = (info) => {
    if (onNavigate) onNavigate("doctor");
    else if (onLoginSuccess) onLoginSuccess(info || { email: email || DEMO_DOCTOR.email });
  };

  // If a saved session is still valid, go straight to the dashboard
  useEffect(() => {
    validateDoctorToken().then((doctor) => {
      if (doctor) goDoctor(doctor);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doLogin = async (loginEmail, loginPassword) => {
    setError("");
    setOfflineNote(false);
    setLoading(true);
    try {
      const { doctor, offline } = await doctorLogin({ email: loginEmail, password: loginPassword });
      if (offline) setOfflineNote(true);
      goDoctor(doctor);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    doLogin(email, password);
  };

  // One-click demo login: fills AND submits (mirrors MotherAuth's demo button).
  const demoLogin = () => {
    setEmail(DEMO_DOCTOR.email);
    setPassword(DEMO_DOCTOR.password);
    doLogin(DEMO_DOCTOR.email, DEMO_DOCTOR.password);
  };

  const goSignup = () => {
    if (onNavigate) onNavigate("signup");
    else if (onSignup) onSignup();
  };

  return (
    <div className="dl-page">
      <div className="dl-card">
        <div className="dl-header">
          <div className="dl-badge">
            <Stethoscope size={26} />
          </div>
          <h2 className="dl-title">{t.loginTitle || "Doctor Login"}</h2>
          <p className="dl-subtitle">
            {t.loginSubtitle || "Access your patient dashboard"}
          </p>
        </div>

        {error && (
          <div className="dl-error" role="alert">
            {error}
          </div>
        )}

        <form className="dl-form" onSubmit={handleSubmit} noValidate>
          <label className="dl-label" htmlFor="dl-email">
            {t.email || "Email"}
          </label>
          <div className="dl-input-wrap">
            <Mail size={18} className="dl-input-icon" />
            <input
              id="dl-email"
              type="email"
              autoComplete="email"
              className="dl-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder || "Enter your email"}
            />
          </div>

          <label className="dl-label" htmlFor="dl-password">
            {t.password || "Password"}
          </label>
          <div className="dl-input-wrap">
            <Lock size={18} className="dl-input-icon" />
            <input
              id="dl-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="dl-input dl-input-pw"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder || "Enter password"}
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

          <button type="submit" className="dl-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="dl-spinner" /> {t.loggingIn || "Logging in..."}
              </>
            ) : (
              <>
                <LogIn size={18} /> {t.login || "Login"}
              </>
            )}
          </button>
        </form>

        <button type="button" className="dl-demo" onClick={demoLogin} disabled={loading}>
          <Sparkles size={16} /> {t.useDemoAccount || "Try demo account →"}
        </button>
        <p className="dl-demo-creds">
          Demo: <code>{DEMO_DOCTOR.email} / {DEMO_DOCTOR.password}</code> — works even without backend
        </p>
        {offlineNote && (
          <p className="dl-offline-note">Offline demo mode — data stays on this device.</p>
        )}

        <p className="dl-footer">
          {t.dontHaveAccount || "Don't have an account?"}{" "}
          <button type="button" className="dl-link" onClick={goSignup}>
            {t.signup || "Sign Up"}
          </button>
          {onBackToHome && !onNavigate && (
            <>
              {" · "}
              <button type="button" className="dl-link" onClick={onBackToHome}>
                ← Back to home
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
