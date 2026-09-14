import React from 'react';
import { LANGUAGES, UI_TRANSLATIONS } from '../data/translations';
import { Check, Globe, Sparkles, ArrowRight } from 'lucide-react';

export default function LanguageSelector({ selectedLang, onSelectLang, onContinue }) {
  const t = UI_TRANSLATIONS[selectedLang] || UI_TRANSLATIONS.en;

  return (
    <div className="language-view-container animate-fade-in">
      <div className="view-header">
        <div className="welcome-badge" style={{ margin: '0 auto 1rem', display: 'inline-flex' }}>
          <Sparkles size={16} />
          <span>FOGSI Safe Motherhood Preconception Assistant</span>
        </div>
        <h1>{t.langSelectTitle}</h1>
        <p>{t.langSelectSubtitle}</p>
      </div>

      <div className="lang-grid">
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLang === lang.id;
          return (
            <button
              key={lang.id}
              className={`lang-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectLang(lang.id)}
              type="button"
            >
              {isSelected && (
                <div className="lang-check-badge">
                  <Check size={14} />
                </div>
              )}
              <span className="lang-native">{lang.native}</span>
              <span className="lang-english">{lang.name}</span>
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          className="btn-primary-lg"
          style={{ margin: '0 auto' }}
          onClick={onContinue}
          type="button"
        >
          <span>{t.next}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
