import React, { useState } from 'react';
import {
  Heart,
  Stethoscope,
  ArrowRight,
  Play,
  MessageCircle,
  Mic,
  FileText,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  Users,
  Lock,
  BookOpen,
  Globe,
  ChevronDown,
  Menu,
  X,
  Calendar,
  Check,
  Baby,
  Smile
} from 'lucide-react';
import { LANGUAGES } from '../data/translations';

export default function LandingPage({
  currentLang = 'en',
  onSelectLanguage,
  onStartPatientAssessment,
  onDoctorLogin,
  onTryDemo,
  onOpenAbout
}) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedLangObj = LANGUAGES.find(l => l.id === currentLang) || LANGUAGES[0];

  const handleScrollTo = (elementId) => {
    setMobileMenuOpen(false);
    const elem = document.getElementById(elementId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page-root" id="home">
      {/* ==================================================
          2. STICKY HEADER
          ================================================== */}
      <header className="landing-sticky-header">
        <div className="landing-header-inner">
          {/* Left: Product Identity & FOGSI Guidelines */}
          <div
            className="landing-brand"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            role="button"
            tabIndex={0}
          >
            <div className="landing-brand-icon">
              <Heart size={20} color="#e11d48" fill="#e11d48" />
            </div>
            <div className="landing-brand-text">
              <span className="landing-brand-name">Preconception Care Assistant</span>
              <span className="landing-brand-badge">FOGSI Safe Motherhood Guidelines</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="landing-nav-center">
            <button
              type="button"
              className="landing-nav-link"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Home
            </button>
            <button
              type="button"
              className="landing-nav-link"
              onClick={() => {
                if (onOpenAbout) onOpenAbout();
                else handleScrollTo('why-preconception');
              }}
            >
              About
            </button>
            <button
              type="button"
              className="landing-nav-link"
              onClick={() => handleScrollTo('how-it-works')}
            >
              Clinical Workflow
            </button>
            <button
              type="button"
              className="landing-nav-link"
              onClick={() => handleScrollTo('for-doctors')}
            >
              For Doctors
            </button>
            <button
              type="button"
              className="landing-nav-link"
              onClick={() => handleScrollTo('why-preconception')}
            >
              Resources
            </button>
          </nav>

          {/* Right: Language Selector & Doctor Login CTA */}
          <div className="landing-header-right">
            {/* Language Selector Dropdown */}
            <div className="lang-dropdown-wrapper">
              <button
                type="button"
                className="landing-lang-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-label="Select Language"
              >
                <Globe size={15} color="#e11d48" />
                <span className="landing-lang-label">{selectedLangObj.native}</span>
                <ChevronDown size={14} color="#64748b" />
              </button>

              {langDropdownOpen && (
                <div className="lang-dropdown-menu animate-fade-in">
                  <div className="lang-menu-title">Select Language</div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      className={`lang-option-item ${currentLang === l.id ? 'active' : ''}`}
                      onClick={() => {
                        if (onSelectLanguage) onSelectLanguage(l.id);
                        setLangDropdownOpen(false);
                      }}
                    >
                      <span className="lang-native">{l.native}</span>
                      <span className="lang-english">{l.name}</span>
                      {currentLang === l.id && <Check size={14} color="#e11d48" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Doctor Login Button */}
            <button
              type="button"
              className="landing-doctor-login-btn"
              onClick={onDoctorLogin}
              id="btn-header-doctor-login"
            >
              <Stethoscope size={16} />
              <span>Doctor Login</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              className="landing-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="landing-mobile-menu animate-fade-in">
            <button
              type="button"
              className="mobile-menu-item"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
            >
              Home
            </button>
            <button
              type="button"
              className="mobile-menu-item"
              onClick={() => {
                if (onOpenAbout) onOpenAbout();
                setMobileMenuOpen(false);
              }}
            >
              About FOGSI Guidelines
            </button>
            <button
              type="button"
              className="mobile-menu-item"
              onClick={() => handleScrollTo('how-it-works')}
            >
              Clinical Workflow (Doctor-Led)
            </button>
            <button
              type="button"
              className="mobile-menu-item"
              onClick={() => handleScrollTo('for-doctors')}
            >
              For Doctors (Clinical Summary)
            </button>
            <button
              type="button"
              className="mobile-menu-item"
              onClick={() => handleScrollTo('why-preconception')}
            >
              Why Preconception Matters
            </button>
            <div className="mobile-menu-divider" />
            <button
              type="button"
              className="btn-primary-lg"
              style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}
              onClick={() => {
                setMobileMenuOpen(false);
                onStartPatientAssessment();
              }}
            >
              Start Clinical Assessment
            </button>
            <button
              type="button"
              className="btn-secondary-clinical"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                setMobileMenuOpen(false);
                onDoctorLogin();
              }}
            >
              <Stethoscope size={16} />
              <span>Doctor Portal</span>
            </button>
          </div>
        )}
      </header>

      {/* ==================================================
          3. HERO SECTION (SPLIT 2-COLUMN)
          ================================================== */}
      <section className="landing-hero-container">
        <div className="landing-hero-content">
          {/* LEFT SIDE */}
          <div className="landing-hero-left">
            {/* Small pill */}
            <div className="hero-pill-badge">
              <span className="pill-heart">❤️</span>
              <span>For Every Mother, Every Time</span>
            </div>

            {/* Main heading */}
            <h1 className="hero-title">
              Prepare today for a{' '}
              <span className="hero-title-highlight">healthier pregnancy</span>{' '}
              tomorrow.
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle">
              A clinician-operated preconception assessment tool. The doctor conducts
              the verbal consultation, records the patient's answers, notes section-level
              observations, and generates instant clinical analytics and JSON.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="hero-cta-row">
              <button
                type="button"
                className="hero-btn-primary"
                onClick={onStartPatientAssessment}
                id="btn-hero-start-assessment"
              >
                <span>Start Clinical Assessment</span>
                <ArrowRight size={18} className="cta-arrow" />
              </button>

              <button
                type="button"
                className="hero-btn-doctor"
                onClick={onDoctorLogin}
                id="btn-hero-doctor-login"
              >
                <Stethoscope size={18} />
                <span>Doctor Login</span>
              </button>
            </div>

            {/* Try Demo link */}
            <div className="hero-demo-row">
              <button
                type="button"
                className="hero-btn-demo"
                onClick={onTryDemo}
                id="btn-hero-try-demo"
              >
                <Play size={14} fill="#e11d48" color="#e11d48" />
                <span>Try Demo Patient (Dr. Preview)</span>
              </button>
            </div>

            {/* FOGSI Initiative Credential */}
            <div className="hero-fogsi-seal">
              <div className="seal-dot" />
              <span>
                An initiative aligned with <strong>FOGSI Safe Motherhood Committee</strong> preconception care clinical protocol.
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: 4. HERO IMAGE / LAYERED FAMILY COLLAGE */}
          <div className="landing-hero-right">
            <div className="hero-collage-wrapper">
              {/* Soft pink circular / organic backdrop shapes */}
              <div className="collage-circle-backdrop backdrop-1" />
              <div className="collage-circle-backdrop backdrop-2" />

              {/* Overlapping Image 1: Pregnant Indian Mother (Large card) */}
              <div className="collage-card card-pregnant">
                <img
                  src="/images/pregnant_mother.jpg"
                  alt="Expectant Indian Mother planning preconception care"
                  className="collage-img"
                  loading="eager"
                />
                <div className="collage-img-overlay" />
              </div>

              {/* Overlapping Image 2: Indian Mother with Baby (Circular) */}
              <div className="collage-card card-mother-baby">
                <img
                  src="/images/mother_baby.jpg"
                  alt="Happy Indian Mother with baby smiling"
                  className="collage-img"
                  loading="eager"
                />
              </div>

              {/* Overlapping Image 3: Indian Couple (Rounded card) */}
              <div className="collage-card card-couple">
                <img
                  src="/images/couple.jpg"
                  alt="Indian couple planning a healthy pregnancy"
                  className="collage-img"
                  loading="eager"
                />
              </div>

              {/* Floating Handwritten-style / Organic Decorative Badges */}
              <div className="floating-badge badge-top-right animate-float-slow">
                <Sparkles size={14} color="#e11d48" />
                <div>
                  <div className="badge-text-primary">Healthy couples,</div>
                  <div className="badge-text-sub">brighter tomorrows.</div>
                </div>
              </div>

              <div className="floating-badge badge-bottom-left animate-float-delayed">
                <Heart size={14} color="#e11d48" fill="#ffe4e6" />
                <div>
                  <div className="badge-text-primary">Care today</div>
                  <div className="badge-text-sub">for generations tomorrow.</div>
                </div>
              </div>

              {/* Small decorative botanical / organic touch */}
              <div className="collage-curved-accent" />
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          8. TRUST / REASSURANCE STRIP
          ================================================== */}
      <section className="trust-strip-section">
        <div className="trust-strip-inner">
          <div className="trust-item">
            <div className="trust-icon-box">
              <Clock size={18} color="#e11d48" />
            </div>
            <span>Takes just 5–10 minutes</span>
          </div>

          <div className="trust-divider" />

          <div className="trust-item">
            <div className="trust-icon-box">
              <Users size={18} color="#e11d48" />
            </div>
            <span>For individuals and couples</span>
          </div>

          <div className="trust-divider" />

          <div className="trust-item">
            <div className="trust-icon-box">
              <Lock size={18} color="#e11d48" />
            </div>
            <span>Your information is private and secure</span>
          </div>

          <div className="trust-divider" />

          <div className="trust-item">
            <div className="trust-icon-box">
              <BookOpen size={18} color="#e11d48" />
            </div>
            <span>Evidence-based preconception guidance</span>
          </div>
        </div>
      </section>

      {/* ==================================================
          7. FEATURE CARDS (4 EQUAL HEIGHT CARDS)
          ================================================== */}
      <section className="feature-cards-section">
        <div className="section-header-centered">
          <div className="section-pill-tag">Key Capabilities</div>
          <h2 className="section-title">Designed with Empathy for Indian Families</h2>
          <p className="section-desc">
            Combining comfortable regional language conversations with rigorous clinical guidelines.
          </p>
        </div>

        <div className="feature-cards-grid">
          {/* CARD 1 */}
          <div className="feature-card-item">
            <div className="feature-icon-circle icon-rose">
              <MessageCircle size={22} color="#e11d48" />
            </div>
            <h3 className="feature-card-title">Guided Conversation</h3>
            <p className="feature-card-desc">
              A friendly, step-by-step experience in your language with clear YES, NO and NOT SURE choices.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="feature-card-item">
            <div className="feature-icon-circle icon-emerald">
              <Mic size={22} color="#059669" />
            </div>
            <h3 className="feature-card-title">Voice + Text Input</h3>
            <p className="feature-card-desc">
              Speak naturally or type your answers. Built-in regional speech recognition and audio read-aloud.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="feature-card-item">
            <div className="feature-icon-circle icon-amber">
              <FileText size={22} color="#d97706" />
            </div>
            <h3 className="feature-card-title">Doctor-Ready Summary</h3>
            <p className="feature-card-desc">
              Your answers are summarized for your doctor with clinical flags before you step into the chamber.
            </p>
          </div>

          {/* CARD 4 */}
          <div className="feature-card-item">
            <div className="feature-icon-circle icon-indigo">
              <ShieldCheck size={22} color="#4f46e5" />
            </div>
            <h3 className="feature-card-title">Evidence-Based</h3>
            <p className="feature-card-desc">
              Built around FOGSI preconception care guidance, covering rubella, folic acid, hemoglobin and genetics.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          10. SECONDARY INFORMATION SECTION
          ================================================== */}
      <section className="why-preconception-section" id="why-preconception">
        <div className="why-inner-container">
          <div className="why-image-side">
            <div className="why-image-frame">
              <img
                src="/images/mother_baby.jpg"
                alt="Mother and healthy child"
                className="why-img"
                loading="lazy"
              />
              <div className="why-image-badge">
                <Heart size={16} color="#e11d48" fill="#e11d48" />
                <span>Safe Motherhood First</span>
              </div>
            </div>
          </div>

          <div className="why-text-side">
            <div className="section-pill-tag">Preventive Maternal Health</div>
            <h2 className="section-title">Why preconception care matters</h2>
            <p className="why-lead-text">
              Planning for pregnancy begins before conception. Understanding health,
              lifestyle, medications and previous pregnancy history can help you and
              your healthcare provider prepare for a healthier pregnancy.
            </p>

            <div className="why-points-list">
              <div className="why-point-row">
                <div className="why-point-bullet">
                  <CheckCircle2 size={18} color="#e11d48" />
                </div>
                <div>
                  <strong>Preconception Folic Acid:</strong> Starting folic acid 3 months prior to conception prevents over 70% of neural tube defects.
                </div>
              </div>

              <div className="why-point-row">
                <div className="why-point-bullet">
                  <CheckCircle2 size={18} color="#e11d48" />
                </div>
                <div>
                  <strong>Managing Pre-existing Conditions:</strong> Optimizing blood sugar (HbA1c), thyroid, and blood pressure prevents pregnancy complications.
                </div>
              </div>

              <div className="why-point-row">
                <div className="why-point-bullet">
                  <CheckCircle2 size={18} color="#e11d48" />
                </div>
                <div>
                  <strong>Medication Safety:</strong> Reviewing prescription medications to substitute safer alternatives before conception occurs.
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.75rem' }}>
              <button
                type="button"
                className="hero-btn-primary"
                onClick={onStartPatientAssessment}
              >
                <span>Take the Free Assessment</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          11. HOW IT WORKS (3 CONNECTED STEPS - CLINICIAN WORKFLOW)
          ================================================== */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-header-centered">
          <div className="section-pill-tag">Doctor-Led Workflow</div>
          <h2 className="section-title">Clinical Assessment Workflow</h2>
          <p className="section-desc">
            Standardized FOGSI preconception history recording conducted verbally by the doctor.
          </p>
        </div>

        <div className="steps-connected-container">
          <div className="steps-connecting-line" />

          {/* Step 01 */}
          <div className="step-card">
            <div className="step-number-bubble">01</div>
            <h3 className="step-card-title">Select Patient</h3>
            <p className="step-card-desc">
              Doctor logs in, adds or selects patient from the clinic registry, and launches assessment.
            </p>
          </div>

          {/* Step 02 */}
          <div className="step-card">
            <div className="step-number-bubble">02</div>
            <h3 className="step-card-title">Verbal Consultation</h3>
            <p className="step-card-desc">
              Doctor asks each question verbally, records YES / NO / NOT SURE, and enters section notes.
            </p>
          </div>

          {/* Step 03 */}
          <div className="step-card">
            <div className="step-number-bubble">03</div>
            <h3 className="step-card-title">Analytics & JSON</h3>
            <p className="step-card-desc">
              On clicking DONE, answers, notes and analytics are saved, generating JSON for records.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          12. FOR DOCTORS SECTION (CLINICIAN EXPERIENCE)
          ================================================== */}
      <section className="for-doctors-section" id="for-doctors">
        <div className="doctors-card-container">
          <div className="doctors-content-left">
            <div className="doctors-pill-tag">
              <Stethoscope size={14} color="#be123c" />
              <span>For Healthcare Professionals</span>
            </div>

            <h2 className="doctors-headline">
              More prepared consultations.<br />Better conversations.
            </h2>

            <p className="doctors-description">
              Review a structured preconception summary before the patient enters
              the consultation room. Focus on high-risk flags, counseling, and timely
              prescriptions rather than routine repetitive history taking.
            </p>

            <div className="doctors-checklist">
              <div className="checklist-item">
                <div className="checklist-check">
                  <Check size={14} color="#059669" />
                </div>
                <span>Patient history & marriage demographics</span>
              </div>
              <div className="checklist-item">
                <div className="checklist-check">
                  <Check size={14} color="#059669" />
                </div>
                <span>Relevant follow-up obstetric & surgical history</span>
              </div>
              <div className="checklist-item">
                <div className="checklist-check">
                  <Check size={14} color="#059669" />
                </div>
                <span>Automated clinician review flags (🟢 Green / 🟡 Yellow / 🔴 Red)</span>
              </div>
              <div className="checklist-item">
                <div className="checklist-check">
                  <Check size={14} color="#059669" />
                </div>
                <span>Doctor notes & clinical examination records (auto-calculated BMI)</span>
              </div>
              <div className="checklist-item">
                <div className="checklist-check">
                  <Check size={14} color="#059669" />
                </div>
                <span>Consultation sign-off, PDF export & print-ready summary</span>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button
                type="button"
                className="doctors-cta-btn"
                onClick={onDoctorLogin}
                id="btn-open-doctor-portal"
              >
                <Stethoscope size={18} />
                <span>Open Doctor Portal →</span>
              </button>
            </div>
          </div>

          <div className="doctors-preview-right">
            <div className="doctor-preview-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <div className="mockup-dot red" />
                  <div className="mockup-dot yellow" />
                  <div className="mockup-dot green" />
                </div>
                <div className="mockup-title">FOGSI Preconception Summary View</div>
              </div>

              <div className="mockup-body">
                <div className="mockup-badge red">
                  <span className="badge-indicator" />
                  <span>High Priority: Previous C-Section (2021)</span>
                </div>
                <div className="mockup-badge yellow">
                  <span className="badge-indicator" />
                  <span>Attention: Family history of Type 2 Diabetes</span>
                </div>
                <div className="mockup-badge green">
                  <span className="badge-indicator" />
                  <span>Folic Acid 5mg Daily initiated</span>
                </div>

                <div className="mockup-vitals-row">
                  <div className="vital-mini-card">
                    <span className="vital-label">BMI</span>
                    <span className="vital-val">22.4</span>
                  </div>
                  <div className="vital-mini-card">
                    <span className="vital-label">BP</span>
                    <span className="vital-val">118/76</span>
                  </div>
                  <div className="vital-mini-card">
                    <span className="vital-label">Hb (Recent)</span>
                    <span className="vital-val">12.1 g/dL</span>
                  </div>
                </div>

                <div className="mockup-footer-note">
                  ✓ Aligned with FOGSI Safe Motherhood Preconception Checklist
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          13. FAMILY / EMOTIONAL SECTION
          ================================================== */}
      <section className="family-emotional-section">
        <div className="emotional-inner">
          <div className="emotional-badge">
            <Heart size={14} color="#e11d48" fill="#ffe4e6" />
            <span>Nurturing Tomorrow</span>
          </div>

          <h2 className="emotional-heading">
            Every healthy pregnancy begins before conception.
          </h2>

          <p className="emotional-text">
            When parents take a few proactive moments to understand their health,
            nutrition, and medical history, they create the strongest possible
            foundation for their baby’s future.
          </p>

          <div className="emotional-collage-strip">
            <div className="emotional-image-item">
              <img
                src="/images/couple.jpg"
                alt="Indian couple planning parenthood"
                loading="lazy"
              />
              <span className="emotional-tag">Shared Family Journey</span>
            </div>

            <div className="emotional-image-item center-highlight">
              <img
                src="/images/pregnant_mother.jpg"
                alt="Pregnant Indian mother"
                loading="lazy"
              />
              <span className="emotional-tag">Care & Protection</span>
            </div>

            <div className="emotional-image-item">
              <img
                src="/images/mother_baby.jpg"
                alt="Indian mother and newborn"
                loading="lazy"
              />
              <span className="emotional-tag">Joyful Health</span>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <button
              type="button"
              className="hero-btn-primary"
              onClick={onStartPatientAssessment}
            >
              <span>Begin Your Assessment Now</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================
          9. MEDICAL DISCLAIMER
          ================================================== */}
      <section className="disclaimer-section">
        <div className="disclaimer-card-wrapper">
          <div className="disclaimer-icon-col">
            <ShieldCheck size={26} color="#e11d48" />
          </div>
          <div className="disclaimer-content-col">
            <h4 className="disclaimer-headline">Not a diagnosis. Not a prescription.</h4>
            <p className="disclaimer-paragraph">
              Your responses are collected to help your healthcare provider prepare for
              your consultation. This assistant does not replace personalized clinical
              advice, diagnosis, or treatment by a qualified doctor.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          14. FOOTER
          ================================================== */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-col-brand">
            <div className="footer-brand-title">
              <Heart size={20} color="#e11d48" fill="#e11d48" />
              <span>Preconception Care Assistant</span>
            </div>
            <div className="footer-brand-subtitle">
              FOGSI Safe Motherhood Guidelines
            </div>
            <p className="footer-brand-desc">
              Empowering couples and healthcare providers with evidence-based preconception
              preparation for safer motherhood and healthier babies across India.
            </p>
          </div>

          <div className="footer-col-links">
            <h4 className="footer-heading">Platform</h4>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Home
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => {
                if (onOpenAbout) onOpenAbout();
                else handleScrollTo('why-preconception');
              }}
            >
              About
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => handleScrollTo('how-it-works')}
            >
              Clinical Workflow
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => handleScrollTo('for-doctors')}
            >
              For Doctors
            </button>
          </div>

          <div className="footer-col-links">
            <h4 className="footer-heading">Clinical Guidance</h4>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => handleScrollTo('why-preconception')}
            >
              FOGSI Safe Motherhood
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => handleScrollTo('why-preconception')}
            >
              Resources & Checklist
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => {
                if (onOpenAbout) onOpenAbout();
              }}
            >
              Medical Disclaimer
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={onDoctorLogin}
            >
              Doctor Login
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-bottom-copy">
            Built to support preconception conversations between patients and healthcare professionals.
          </p>
          <div className="footer-languages-tag">
            Available in English, हिन्दी, తెలుగు, தமிழ், ಕನ್ನಡ, മലയാളം, বাংলা, मराठी
          </div>
        </div>
      </footer>
    </div>
  );
}
