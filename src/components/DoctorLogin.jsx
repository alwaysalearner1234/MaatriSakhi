import React, { useState, useEffect } from "react";
import { UI_TRANSLATIONS, LANGUAGES } from "../data/translations";
import { Stethoscope, Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import "./DoctorLogin.css";

// Backend address: set VITE_API_URL in .env.local (local) or in Render (live)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function DoctorLogin({ lang, onSelectLanguage, onNavigate }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If a saved token is still valid, go straight to the dashboard
  useEffect(() => {
    const token = localStorage.getItem("doctor_token");
    if (!token) return;
    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) onNavigate("doctor");
        else localStorage.removeItem("doctor_token");
      })
      .catch(() => {
        /* backend offline: stay on the login screen */
      });
  }, [onNavigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);

    let response;
    try {
      response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      setError("Can't reach the server. Please make sure the backend is running.");
      setLoading(false);
      return;
    }

    let data = {};
    try {
      data = await response.json();
    } catch {
      /* non-JSON reply */
    }

    if (response.ok && data.access_token) {
      localStorage.setItem("doctor_token", data.access_token);
      onNavigate("doctor");
    } else if (response.status === 401) {
      setError("Incorrect email or password.");
    } else {
      setError(
        typeof data.detail === "string"
          ? data.detail
          : `Login failed (error ${response.status}). Please try again.`
      );
    }
    setLoading(false);
  };

  const fillDemoAccount = () => {
    setEmail("doctor@maatri.sakhi");
    setPassword("doctor123");
    setError("");
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

        <button type="button" className="dl-demo" onClick={fillDemoAccount}>
          <Sparkles size={16} /> {t.useDemoAccount || "Use demo account"}
        </button>

        <p className="dl-footer">
          {t.dontHaveAccount || "Don't have an account?"}{" "}
          <button
            type="button"
            className="dl-link"
            onClick={() => onNavigate("signup")}
          >
            {t.signup || "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
