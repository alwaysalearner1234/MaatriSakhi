import React, { useState, useEffect } from "react";
import { UI_TRANSLATIONS, LANGUAGES } from "../data/translations";
import {
  Users,
  Globe,
  CheckCircle2,
  X,
  Mail,
  Phone,
  Lock,
  Unlock,
  Shield,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function DoctorLogin({
  lang,
  onSelectLanguage,
  onNavigate,
}) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const currentLangObj = LANGUAGES.find((l) => l.id === lang) || LANGUAGES[0];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState(lang || "en");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if already logged in (read token from localStorage on mount)
  useEffect(() => {
    const token = localStorage.getItem("doctor_token");
    if (token) {
      // Verify the token by calling the backend
      fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            setLoggedIn(true);
            onNavigate("doctor");
          } else {
            // Token invalid, remove it
            localStorage.removeItem("doctor_token");
            setLoggedIn(false);
          }
        })
        .catch(() => {
          localStorage.removeItem("doctor_token");
          setLoggedIn(false);
        });
    }
  }, [onNavigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t.requiredNotice || "Please enter email and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT token in localStorage
        if (data.access_token) {
          localStorage.setItem("doctor_token", data.access_token);
        }
        setLoading(false);
        setLoggedIn(true);
        setTimeout(() => onNavigate("doctor"), 500);
      } else {
        setError(data.detail || "Login failed. Please check your credentials.");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (loggedIn) {
    return null; // Already logged in, redirect handled by useEffect
  }

  return (
    <div className="auth-card-container animate-fade-in">
      <div className="auth-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div className="auth-badge">
            <span>🌸 MaatriSakhi</span>
          </div>

          <button
            className="nav-pill-btn"
            onClick={onSelectLanguage}
            title="Switch Language"
            type="button"
          >
            <Globe size={15} />
            <span>{currentLangObj.native}</span>
          </button>
        </div>

        <div className="maatri-logo-wrapper">
          <img
            src="/MaatriSakhi.png"
            alt="MaatriSakhi - Preconception Care Assistant"
            className="maatri-logo maatri-logo-auth"
          />
        </div>

        <h2 className="auth-title">{t.appTitle}</h2>
        <p className="auth-subtitle">Based on FOGSI Safe Motherhood Guidelines</p>

        {error && (
          <div className="error-banner">
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t.email || "Email"}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder || "Enter your email"}
              style={{ width: "100%" }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t.password || "Password"}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder || "Enter password"}
              style={{ width: "100%" }}
            />
          </div>

          <button type="submit" className="submit-btn">
            {t.login || "Login"}
          </button>
        </form>

        <div className="auth-links">
          <span>{t.dontHaveAccount || "Don't have an account?"}</span>
          <button
            onClick={() => onNavigate("/signup")}
            className="signup-link"
          >
            {t.signup || "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}