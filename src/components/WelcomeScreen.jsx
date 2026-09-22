import React from 'react';
import { UI_TRANSLATIONS, LANGUAGES } from '../data/translations';
import { Clock, Mic, Keyboard, FileText, ShieldAlert, Volume2, ArrowRight, Play, Globe } from 'lucide-react';

export default function WelcomeScreen({
  lang,
  autoReadAloud,
  onToggleAutoRead,
  onStartAssessment,
  onStartDemo,
  onChangeLanguage
}) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const currentLangObj = LANGUAGES.find(l => l.id === lang) || LANGUAGES[0];

  return (
    <div className="welcome-card-container animate-fade-in">
      <div className="welcome-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="welcome-badge">
            <span>🌸 Safe Motherhood Committee, FOGSI</span>
          </div>

          <button
            className="nav-pill-btn"
            onClick={onChangeLanguage}
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
            className="maatri-logo maatri-logo-welcome"
          />
        </div>

        <h1 className="welcome-title">{t.welcomeHeading}</h1>
        <p className="welcome-subtitle">{t.welcomeSubheading}</p>

        <div className="features-pill-grid">
          <div className="feature-pill">
            <Clock size={16} color="#e11d48" />
            <span>{t.timeEstimate}</span>
          </div>
          <div className="feature-pill">
            <Mic size={16} color="#059669" />
            <span>{t.voiceAvailable}</span>
          </div>
          <div className="feature-pill">
            <Keyboard size={16} color="#475569" />
            <span>{t.typeAvailable}</span>
          </div>
          <div className="feature-pill">
            <FileText size={16} color="#d97706" />
            <span>{t.doctorSummaryNotice}</span>
          </div>
        </div>

        {/* Read aloud toggle option */}
        <div style={{
          background: 'var(--surface-alt)',
          padding: '0.85rem 1.15rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Volume2 size={18} color="#e11d48" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {t.readAloudToggle}
            </span>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px' }}>
            <input
              type="checkbox"
              checked={autoReadAloud}
              onChange={(e) => onToggleAutoRead(e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: autoReadAloud ? '#e11d48' : '#cbd5e1',
              borderRadius: '26px',
              transition: '.3s'
            }}>
              <span style={{
                position: 'absolute',
                content: '""',
                height: '20px',
                width: '20px',
                left: autoReadAloud ? '24px' : '4px',
                bottom: '3px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: '.3s'
              }} />
            </span>
          </label>
        </div>

        <div className="disclaimer-box">
          <div className="disclaimer-title">
            <ShieldAlert size={16} />
            <span>{t.disclaimerTitle}</span>
          </div>
          <p className="disclaimer-body">{t.disclaimerText}</p>
        </div>

        <div className="welcome-action-group">
          <button className="btn-primary-lg" onClick={onStartAssessment} type="button">
            <span>{t.startAssessment}</span>
            <ArrowRight size={20} />
          </button>

          <button className="btn-demo-outline" onClick={onStartDemo} type="button">
            <Play size={16} />
            <span>{t.tryDemo}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
