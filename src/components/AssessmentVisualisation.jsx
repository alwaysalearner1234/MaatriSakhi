import React, { useMemo, useState } from 'react';
import { SECTIONS_META, QUESTIONS, generateClinicianFlags } from '../data/fogsiQuestions';
import { formatAnswerValue } from '../utils/answerFormatter';
import { calculateAssessmentAnalytics, downloadAssessmentJson, generateAssessmentJson } from '../utils/assessmentJsonGenerator';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Activity,
  Heart,
  Baby,
  Dna,
  Pill,
  ShieldCheck,
  Apple,
  Coffee,
  Trees,
  Smile,
  HeartHandshake,
  Scissors,
  FileText,
  Printer,
  Download,
  ArrowRight,
  Sparkles,
  TrendingUp,
  User,
  Clock,
  Calendar,
  Phone,
  Check,
  X,
  HelpCircle,
  Stethoscope,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Code
} from 'lucide-react';

const SECTION_ICONS = {
  intention: HeartHandshake,
  marital: Heart,
  obstetric: Baby,
  medical: Activity,
  surgical: Scissors,
  family: Dna,
  medications: Pill,
  infections: ShieldCheck,
  nutrition: Apple,
  lifestyle: Coffee,
  environment: Trees,
  mental: Smile
};

export default function AssessmentVisualisation({
  patient,
  assessment,
  answers = {},
  flags = [],
  sectionNotes = {},
  selectedAssessmentId = null,
  onSelectAssessment,
  onSwitchToSummary,
  onStartNewAssessment,
  isRecentCompletion = false
}) {
  const [selectedDomainId, setSelectedDomainId] = useState(null);
  const [answerFilter, setAnswerFilter] = useState('all');
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Normalize sectionNotes whether passed as object { [sec.id]: string } or array [{ sectionId, note }]
  const normalizedSectionNotes = useMemo(() => {
    if (!sectionNotes) return {};
    if (Array.isArray(sectionNotes)) {
      const obj = {};
      sectionNotes.forEach(item => {
        if (item && item.sectionId) {
          obj[item.sectionId] = item.note || '';
        }
      });
      return obj;
    }
    return sectionNotes;
  }, [sectionNotes]);

  // Calculate actual analytics strictly from the entered answers (no dummy data)
  const analytics = useMemo(() => {
    return calculateAssessmentAnalytics(answers, assessment?.history || []);
  }, [answers, assessment]);

  // Complete list of all answered questions
  const allAnswerList = useMemo(() => {
    const list = [];
    SECTIONS_META.forEach(sec => {
      const secQuestions = QUESTIONS.filter(q => q.section === sec.id);
      const followUps = QUESTIONS.flatMap(q => q.followUps || []).filter(sub => sub.section === sec.id);
      const allQ = [...secQuestions, ...followUps];

      allQ.forEach(q => {
        if (answers[q.id] !== undefined) {
          const val = answers[q.id];
          list.push({
            qId: q.id,
            sectionId: sec.id,
            sectionTitle: sec?.title?.en || sec.id,
            questionText: q.question.en,
            answerValue: val,
            answerDisplay: formatAnswerValue(val),
            source: q.source || null
          });
        }
      });
    });
    return list;
  }, [answers]);

  const filteredAnswerList = useMemo(() => {
    if (answerFilter === 'all') return allAnswerList;
    if (answerFilter === 'yes') return allAnswerList.filter(a => a.answerValue === 'yes');
    if (answerFilter === 'no') return allAnswerList.filter(a => a.answerValue === 'no');
    if (answerFilter === 'not_sure') return allAnswerList.filter(a => a.answerValue === 'not_sure');
    return allAnswerList;
  }, [allAnswerList, answerFilter]);

  // Calculate Preconception Readiness & Risk Score (0 - 100)
  const readinessMetrics = useMemo(() => {
    let score = 100;
    const deductions = [];
    const protectiveFactors = [];

    // Attention flags (-12 each)
    const attentionFlags = flags.filter(f => f.level === 'attention');
    if (attentionFlags.length > 0) {
      const penalty = Math.min(attentionFlags.length * 12, 36);
      score -= penalty;
      deductions.push({
        title: `${attentionFlags.length} High-Attention Clinical Finding${attentionFlags.length > 1 ? 's' : ''}`,
        penalty: `-${penalty}`,
        detail: attentionFlags.map(f => f.title).join('; ')
      });
    }

    // Review flags (-6 each)
    const reviewFlags = flags.filter(f => f.level === 'review');
    if (reviewFlags.length > 0) {
      const penalty = Math.min(reviewFlags.length * 6, 24);
      score -= penalty;
      deductions.push({
        title: `${reviewFlags.length} Clinician Review Item${reviewFlags.length > 1 ? 's' : ''}`,
        penalty: `-${penalty}`,
        detail: reviewFlags.map(f => f.title).join('; ')
      });
    }

    // Folic acid status
    if (answers['folic_acid_intake'] === 'yes') {
      score = Math.min(100, score + 4);
      protectiveFactors.push("Patient already compliant on daily preconception folic acid");
    } else if (answers['folic_acid_intake'] === 'no') {
      score -= 8;
      deductions.push({
        title: "No Folic Acid Supplementation Yet",
        penalty: "-8",
        detail: "FOGSI guidelines urge immediate folic acid initiation ≥ 1–3 months prior to conception"
      });
    }

    // Lifestyle protective factors
    if (answers['tobacco_use'] === 'neither' && answers['alcohol_use'] === 'neither') {
      protectiveFactors.push("Zero tobacco and alcohol exposure reported");
    }

    // Consanguinity check
    if (answers['consanguineous_marriage'] === 'yes') {
      deductions.push({
        title: "Consanguineous Union",
        penalty: "FOGSI Protocol",
        detail: "Requires mandatory couple hemoglobinopathy (Hb HPLC) carrier screening"
      });
    }

    // Clamped score
    score = Math.max(25, Math.min(100, Math.round(score)));

    let category = 'optimal';
    let label = 'Optimal Preconception Health';
    let subtitle = 'Routine preconception counselling and standard folic acid (400 μg) recommended.';
    let color = '#059669';
    let bgLight = '#ecfdf5';

    if (score < 60) {
      category = 'high_risk';
      label = 'Specialist Medical Optimization Required';
      subtitle = 'Multiple high-priority clinical flags detected. Multidisciplinary review advised prior to conception.';
      color = '#e11d48';
      bgLight = '#fff1f2';
    } else if (score < 80) {
      category = 'moderate_risk';
      label = 'Preconception Health Optimization Needed';
      subtitle = 'Identified risk factors require specific interventions, lab investigations, or medication adjustments.';
      color = '#d97706';
      bgLight = '#fffbeb';
    }

    return {
      score,
      category,
      label,
      subtitle,
      color,
      bgLight,
      deductions,
      protectiveFactors,
      attentionCount: attentionFlags.length,
      reviewCount: reviewFlags.length
    };
  }, [answers, flags]);

  // 12 FOGSI Domains detailed health statuses
  const domainSummaries = useMemo(() => {
    return SECTIONS_META.map((sec, idx) => {
      const secQuestions = QUESTIONS.filter(q => q.section === sec.id);
      const followUps = QUESTIONS.flatMap(q => q.followUps || []).filter(sub => sub.section === sec.id);
      const allQuestions = [...secQuestions, ...followUps];

      const answeredInSec = allQuestions.filter(q => answers[q.id] !== undefined);
      const yesCount = answeredInSec.filter(q => answers[q.id] === 'yes').length;
      const noCount = answeredInSec.filter(q => answers[q.id] === 'no').length;
      const notSureCount = answeredInSec.filter(q => answers[q.id] === 'not_sure').length;

      // Extract flags that belong to this section's category
      const secFlags = flags.filter(f => {
        const cat = (f.category || '').toLowerCase();
        const secId = sec.id.toLowerCase();
        if (secId === 'medical' && cat.includes('medical')) return true;
        if (secId === 'obstetric' && cat.includes('obstetric')) return true;
        if (secId === 'marital' && (cat.includes('consanguin') || cat.includes('marital'))) return true;
        if (secId === 'medications' && cat.includes('medication')) return true;
        if (secId === 'family' && cat.includes('genetic')) return true;
        if (secId === 'infections' && cat.includes('immuniz')) return true;
        if (secId === 'nutrition' && cat.includes('nutrition')) return true;
        if (secId === 'lifestyle' && cat.includes('lifestyle')) return true;
        if (secId === 'environment' && cat.includes('environment')) return true;
        if (secId === 'mental' && cat.includes('mental')) return true;
        if (secId === 'surgical' && cat.includes('surgic')) return true;
        return false;
      });

      let status = 'normal';
      let statusLabel = 'Cleared';
      let statusColor = '#059669';

      if (secFlags.some(f => f.level === 'attention')) {
        status = 'attention';
        statusLabel = 'Attention';
        statusColor = '#e11d48';
      } else if (secFlags.some(f => f.level === 'review')) {
        status = 'review';
        statusLabel = 'Review Needed';
        statusColor = '#d97706';
      } else if (answeredInSec.length === 0) {
        status = 'unscreened';
        statusLabel = 'Unscreened';
        statusColor = '#94a3b8';
      }

      // Key affirmative findings in this section
      const positiveHighlights = [];
      answeredInSec.forEach(q => {
        const val = answers[q.id];
        if (val === 'yes' || (val && val !== 'no' && val !== 'neither' && val !== 'not_sure')) {
          const qShort = q.question.en.replace(/^Do you have|^Are you|^Have you ever|^Is there/, '').trim();
          positiveHighlights.push({
            id: q.id,
            text: `${qShort.slice(0, 45)}: ${formatAnswerValue(val)}`
          });
        }
      });

      const note = normalizedSectionNotes[sec.id] || null;

      return {
        id: sec.id,
        number: idx + 1,
        title: sec?.title?.en || sec.id,
        icon: SECTION_ICONS[sec.id] || FileText,
        totalQuestions: allQuestions.length,
        answeredCount: answeredInSec.length,
        yesCount,
        noCount,
        notSureCount,
        flags: secFlags,
        status,
        statusLabel,
        statusColor,
        highlights: positiveHighlights,
        note
      };
    });
  }, [answers, flags, normalizedSectionNotes]);

  // Folic acid prescriptive guidance based on actual answers
  const folicAcidGuidance = useMemo(() => {
    const isHighRisk =
      answers['medical_diabetes'] === 'yes' ||
      answers['medical_epilepsy'] === 'yes' ||
      answers['history_birth_defects'] === 'yes' ||
      answers['bmi_category'] === 'obese_30_plus' ||
      flags.some(f => f.id === 'flag_high_risk_folic');

    if (isHighRisk) {
      return {
        dose: '5.0 mg / day',
        type: 'High-Dose Protocol',
        badgeColor: '#be123c',
        rationale: 'High-risk indication identified (Diabetes, Epilepsy, Neural Tube Defect history, or BMI > 30). Start 5 mg daily ≥ 1–3 months prior to conception.'
      };
    }
    return {
      dose: '400 – 800 μg / day',
      type: 'Standard Preconception Protocol',
      badgeColor: '#059669',
      rationale: 'Standard risk profile. Initiate 400–800 μg daily ≥ 1 month prior to conception to prevent neural tube defects (NTD).'
    };
  }, [answers, flags]);

  // Recommended baseline investigations derived from patient findings
  const recommendedInvestigations = useMemo(() => {
    const tests = [
      { name: 'Complete Blood Count (CBC) & Hemoglobin', reason: 'Anemia & baseline hematology', priority: 'routine' },
      { name: 'ABO Blood Grouping & Rh Typing', reason: 'Rh isoimmunization prevention', priority: 'routine' },
      { name: 'Urine Routine & Microscopy', reason: 'Asymptomatic bacteriuria & proteinuria screening', priority: 'routine' },
      { name: 'Rubella IgG Antibody Titre', reason: 'Congenital Rubella Syndrome immunity verification', priority: 'routine' }
    ];

    if (answers['consanguineous_marriage'] === 'yes' || answers['family_genetic'] === 'yes') {
      tests.unshift({
        name: 'Hemoglobin HPLC / Electrophoresis (Couple)',
        reason: 'Thalassemia & hemoglobinopathy carrier screening (Consanguinity / Family history)',
        priority: 'high'
      });
    }

    if (answers['medical_diabetes'] === 'yes' || answers['gestational_diabetes'] === 'yes') {
      tests.unshift({
        name: 'HbA1c & Fasting / Postprandial Blood Glucose',
        reason: 'Preconception glycaemic control (FOGSI Target: HbA1c < 6.5%)',
        priority: 'high'
      });
    }

    if (answers['medical_thyroid'] === 'yes') {
      tests.unshift({
        name: 'Serum TSH & Free T4',
        reason: 'Thyroid dose optimization (FOGSI Target TSH: < 2.5 mIU/L)',
        priority: 'high'
      });
    }

    if (answers['medical_hypertension'] === 'yes') {
      tests.push({
        name: 'Serum Creatinine, Blood Urea & 24h Urine Protein',
        reason: 'Baseline renal assessment in chronic hypertension',
        priority: 'high'
      });
    }

    return tests;
  }, [answers]);

  // Donut chart calculations
  const donutData = useMemo(() => {
    const total = analytics.total_answered || 1;
    return {
      total: analytics.total_answered,
      yes: { count: analytics.yes, pct: Math.round((analytics.yes / total) * 100) },
      no: { count: analytics.no, pct: Math.round((analytics.no / total) * 100) },
      notSure: { count: analytics.not_sure, pct: Math.round((analytics.not_sure / total) * 100) },
      flagged: { count: analytics.flagged, pct: Math.round((analytics.flagged / total) * 100) }
    };
  }, [analytics]);

  const gaugeRadius = 48;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const strokeDashoffset = gaugeCircumference - (readinessMetrics.score / 100) * gaugeCircumference;

  return (
    <div className="assessment-visualisation-root animate-fade-in" id="visualisation-hub">
      {/* ──────────────────────────────────────────────────
          1. COMPLETION HERO BANNER
          ────────────────────────────────────────────────── */}
      <div className="assessment-completion-hero">
        <div className="completion-hero-left">
          <div className="hero-status-pill">
            <CheckCircle2 size={16} color="#059669" />
            <span>ASSESSMENT SUBMITTED & ANALYZED • FOGSI PRECONCEPTION PROTOCOL</span>
          </div>

          <h1 className="hero-patient-title">
            Visual Assessment Report: <span className="hero-highlight">{patient?.name || 'Walk-In Consultation'}</span>
          </h1>

          <div className="hero-meta-chips">
            <span className="hero-meta-chip">
              <User size={14} color="#be123c" />
              <strong>ID:</strong> {patient?.id || 'PT-REG'}
            </span>
            <span className="hero-meta-chip">
              <Calendar size={14} color="#be123c" />
              <strong>Age:</strong> {patient?.age ? `${patient.age} yrs` : '28 yrs'}
            </span>
            <span className="hero-meta-chip">
              <Clock size={14} color="#be123c" />
              <strong>Submitted:</strong> {patient?.completedAt || assessment?.date || 'Today'}
            </span>
            <span className="hero-meta-chip">
              <Activity size={14} color="#059669" />
              <strong>Answers:</strong> {analytics.total_answered} Recorded
            </span>
            {analytics.flagged > 0 && (
              <span className="hero-meta-chip chip-flagged">
                <AlertCircle size={14} color="#e11d48" />
                <strong>Flags:</strong> {analytics.flagged} Clinician Items
              </span>
            )}
          </div>
        </div>

        <div className="completion-hero-actions btn-print-hide">
          <button
            type="button"
            className="btn-hero-primary"
            onClick={onSwitchToSummary}
            title="Open printable FOGSI Pre-Visit Summary Checklist"
          >
            <FileText size={16} />
            <span>Full Clinical Checklist</span>
          </button>

          <button
            type="button"
            className="btn-hero-secondary"
            onClick={() => setIsJsonModalOpen(true)}
            title="View standardized JSON payload"
          >
            <Code size={15} />
            <span>View JSON</span>
          </button>

          <button
            type="button"
            className="btn-hero-secondary"
            onClick={() => {
              const payload = assessment?.jsonPayload || generateAssessmentJson({
                patient: patient,
                history: assessment?.history || [],
                answers: answers,
                sectionNotes: normalizedSectionNotes,
                assessmentDate: assessment?.isoDate || patient?.completedAt,
                assessmentStatus: 'completed'
              });
              downloadAssessmentJson(payload, patient?.name || 'patient');
            }}
            title="Download standardized JSON for records"
          >
            <Download size={15} />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            className="btn-hero-secondary"
            onClick={() => window.print()}
            title="Print assessment visual summary"
          >
            <Printer size={15} />
            <span>Print Report</span>
          </button>

          {onStartNewAssessment && (
            <button
              type="button"
              className="btn-hero-secondary"
              onClick={() => onStartNewAssessment(patient)}
              title="Start another assessment for this patient"
            >
              <RefreshCw size={15} />
              <span>New Assessment</span>
            </button>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────
          PATIENT DETAILS DEMOGRAPHICS & RETURNING CONSULTATIONS
          ────────────────────────────────────────────────── */}
      <div className="patient-demographics-summary-card">
        <div className="demographics-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <User size={18} color="#be123c" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Patient Details & Consultation Records
            </h3>
          </div>
          {patient?.assessments && patient.assessments.length > 1 && (
            <div className="assessment-history-chips">
              <span className="history-label">Previous Consultations:</span>
              {patient.assessments.map((asm, idx) => (
                <button
                  key={asm.id || idx}
                  type="button"
                  className={`history-pill ${selectedAssessmentId === asm.id ? 'active' : ''}`}
                  onClick={() => onSelectAssessment && onSelectAssessment(asm.id)}
                >
                  <span>{asm.date || `Consultation #${idx + 1}`}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="demographics-grid">
          <div className="demo-item">
            <span className="demo-lbl">Full Patient Name:</span>
            <strong className="demo-val">{patient?.name || 'Walk-In Patient'}</strong>
          </div>
          <div className="demo-item">
            <span className="demo-lbl">Age / DOB:</span>
            <strong className="demo-val">{patient?.age ? `${patient.age} Years` : '28 Years'}</strong>
          </div>
          <div className="demo-item">
            <span className="demo-lbl">Contact Phone:</span>
            <strong className="demo-val">{patient?.phone || 'Not provided'}</strong>
          </div>
          <div className="demo-item">
            <span className="demo-lbl">Residential Address / City:</span>
            <strong className="demo-val">{patient?.address || patient?.city || 'Local Clinic Visit'}</strong>
          </div>
          <div className="demo-item">
            <span className="demo-lbl">Assessment Date & Time:</span>
            <strong className="demo-val" style={{ color: '#be123c' }}>
              {patient?.completedAt || assessment?.date || 'Today'}
            </strong>
          </div>
          <div className="demo-item">
            <span className="demo-lbl">Marital Duration:</span>
            <strong className="demo-val">
              {patient?.yearsMarried !== undefined && patient?.yearsMarried !== ''
                ? `${patient.yearsMarried} Year${patient.yearsMarried === 1 ? '' : 's'}`
                : (patient?.marriageDate ? patient.marriageDate : 'Not specified')}
            </strong>
          </div>
          <div className="demo-item full-width">
            <span className="demo-lbl">Clinical Background / Description:</span>
            <span className="demo-val-desc">
              {patient?.doctorDescription || 'Standard preconception pre-pregnancy evaluation consultation.'}
            </span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────
          ACTUAL CALCULATED ANSWER METRICS
          ────────────────────────────────────────────────── */}
      <div className="actual-metrics-banner">
        <div className="actual-metric-box metric-total">
          <span className="metric-box-val">{analytics.total_answered}</span>
          <span className="metric-box-lbl">Total Answered</span>
        </div>
        <div className="actual-metric-box metric-yes">
          <span className="metric-box-val">
            <Check size={18} strokeWidth={3} />
            {analytics.yes}
          </span>
          <span className="metric-box-lbl">YES Count</span>
        </div>
        <div className="actual-metric-box metric-no">
          <span className="metric-box-val">
            <X size={18} strokeWidth={3} />
            {analytics.no}
          </span>
          <span className="metric-box-lbl">NO Count</span>
        </div>
        <div className="actual-metric-box metric-not-sure">
          <span className="metric-box-val">
            <HelpCircle size={18} />
            {analytics.not_sure}
          </span>
          <span className="metric-box-lbl">NOT SURE Count</span>
        </div>
        <div className="actual-metric-box metric-flags">
          <span className="metric-box-val">
            <AlertCircle size={18} />
            {analytics.flagged}
          </span>
          <span className="metric-box-lbl">Clinical Flags</span>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────
          2. KEY VISUAL INDICES (READINESS GAUGE, DONUT, FLAGS)
          ────────────────────────────────────────────────── */}
      <div className="visual-metrics-grid">
        {/* Metric 1: Preconception Health & Readiness Index */}
        <div className="visual-metric-card card-gauge">
          <div className="metric-card-header">
            <div className="metric-card-title-group">
              <Sparkles size={18} color="#e11d48" />
              <h3 className="metric-card-title">Preconception Readiness Index</h3>
            </div>
            <span
              className="readiness-tier-badge"
              style={{ background: readinessMetrics.bgLight, color: readinessMetrics.color }}
            >
              {readinessMetrics.score >= 80 ? 'Optimal' : readinessMetrics.score >= 60 ? 'Moderate' : 'High Risk'}
            </span>
          </div>

          <div className="gauge-display-row">
            <div className="circular-gauge-wrapper">
              <svg className="gauge-svg" width="120" height="120" viewBox="0 0 120 120">
                <circle
                  className="gauge-bg"
                  cx="60"
                  cy="60"
                  r={gaugeRadius}
                  stroke="#f1f5f9"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  className="gauge-progress"
                  cx="60"
                  cy="60"
                  r={gaugeRadius}
                  stroke={readinessMetrics.color}
                  strokeWidth="10"
                  strokeDasharray={gaugeCircumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="gauge-center-text">
                <span className="gauge-pct" style={{ color: readinessMetrics.color }}>
                  {readinessMetrics.score}%
                </span>
                <span className="gauge-lbl">Index</span>
              </div>
            </div>

            <div className="gauge-details">
              <h4 className="readiness-headline" style={{ color: readinessMetrics.color }}>
                {readinessMetrics.label}
              </h4>
              <p className="readiness-subtitle">{readinessMetrics.subtitle}</p>

              <div className="readiness-factors-list">
                {readinessMetrics.deductions.slice(0, 2).map((d, i) => (
                  <div key={i} className="readiness-factor-item deduction">
                    <AlertTriangle size={13} color="#e11d48" />
                    <span><strong>{d.title}:</strong> {d.detail}</span>
                  </div>
                ))}
                {readinessMetrics.protectiveFactors.slice(0, 1).map((p, i) => (
                  <div key={i} className="readiness-factor-item positive">
                    <CheckCircle2 size={13} color="#059669" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2: Responses Distribution (Interactive Donut Chart) */}
        <div className="visual-metric-card card-donut">
          <div className="metric-card-header">
            <div className="metric-card-title-group">
              <Activity size={18} color="#059669" />
              <h3 className="metric-card-title">Response Breakdown</h3>
            </div>
            <span className="metric-card-subbadge">
              {donutData.total} Questions
            </span>
          </div>

          <div className="donut-display-row">
            <div className="donut-chart-box">
              <svg width="115" height="115" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="18" />
                {/* YES Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="18"
                  strokeDasharray={`${(donutData.yes.count / (donutData.total || 1)) * 238.76} 238.76`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                {/* NO Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#64748b"
                  strokeWidth="18"
                  strokeDasharray={`${(donutData.no.count / (donutData.total || 1)) * 238.76} 238.76`}
                  strokeDashoffset={`-${(donutData.yes.count / (donutData.total || 1)) * 238.76}`}
                  transform="rotate(-90 50 50)"
                />
                {/* NOT SURE Segment */}
                {donutData.notSure.count > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="18"
                    strokeDasharray={`${(donutData.notSure.count / (donutData.total || 1)) * 238.76} 238.76`}
                    strokeDashoffset={`-${((donutData.yes.count + donutData.no.count) / (donutData.total || 1)) * 238.76}`}
                    transform="rotate(-90 50 50)"
                  />
                )}
                {/* Center text */}
                <text x="50" y="47" textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a">
                  {donutData.total}
                </text>
                <text x="50" y="60" textAnchor="middle" fontSize="8" fontWeight="600" fill="#64748b">
                  ANSWERS
                </text>
              </svg>
            </div>

            <div className="donut-legend-stack">
              <div className="donut-legend-item">
                <span className="legend-dot dot-yes" />
                <span className="legend-label">YES Affirmative:</span>
                <strong className="legend-val">{donutData.yes.count}</strong>
                <span className="legend-pct">({donutData.yes.pct}%)</span>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot dot-no" />
                <span className="legend-label">NO / Cleared:</span>
                <strong className="legend-val">{donutData.no.count}</strong>
                <span className="legend-pct">({donutData.no.pct}%)</span>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot dot-not-sure" />
                <span className="legend-label">NOT SURE:</span>
                <strong className="legend-val">{donutData.notSure.count}</strong>
                <span className="legend-pct">({donutData.notSure.pct}%)</span>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot dot-flag" />
                <span className="legend-label">Flags Raised:</span>
                <strong className="legend-val text-rose">{analytics.flagged}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3: Clinical Risk Severity Overview */}
        <div className="visual-metric-card card-flags-summary">
          <div className="metric-card-header">
            <div className="metric-card-title-group">
              <ShieldCheck size={18} color="#be123c" />
              <h3 className="metric-card-title">Clinical Flags Severity</h3>
            </div>
            <span className="metric-card-subbadge">FOGSI Triage</span>
          </div>

          <div className="flags-bars-stack">
            <div className="flag-severity-row severity-attention">
              <div className="severity-info">
                <span className="severity-tag tag-red">🔴 Important Attention</span>
                <span className="severity-desc">Immediate clinician intervention required</span>
              </div>
              <strong className="severity-count">{readinessMetrics.attentionCount}</strong>
            </div>

            <div className="flag-severity-row severity-review">
              <div className="severity-info">
                <span className="severity-tag tag-amber">🟡 Clinician Review</span>
                <span className="severity-desc">Preconception counselling / optimization</span>
              </div>
              <strong className="severity-count">{readinessMetrics.reviewCount}</strong>
            </div>

            <div className="flag-severity-row severity-optimal">
              <div className="severity-info">
                <span className="severity-tag tag-green">🟢 Cleared Domains</span>
                <span className="severity-desc">Standard preventive guidance applies</span>
              </div>
              <strong className="severity-count">
                {domainSummaries.filter(d => d.status === 'normal').length} of 12
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────
          3. 12 FOGSI CLINICAL DOMAINS HEALTH MATRIX
          ────────────────────────────────────────────────── */}
      <div className="domain-matrix-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">12 FOGSI Clinical Domains Health Matrix</h2>
            <p className="section-subtitle">
              Comprehensive status mapping across all 12 preconception domains. Click any domain card to highlight recorded details and clinical guidance.
            </p>
          </div>

          <div className="domain-filter-legend">
            <span className="legend-pill pill-red">🔴 Attention ({domainSummaries.filter(d => d.status === 'attention').length})</span>
            <span className="legend-pill pill-amber">🟡 Review ({domainSummaries.filter(d => d.status === 'review').length})</span>
            <span className="legend-pill pill-green">🟢 Cleared ({domainSummaries.filter(d => d.status === 'normal').length})</span>
          </div>
        </div>

        <div className="domain-cards-grid">
          {domainSummaries.map((dom) => {
            const IconComp = dom.icon;
            const isSelected = selectedDomainId === dom.id;
            const pctCovered = dom.totalQuestions > 0 ? Math.round((dom.answeredCount / dom.totalQuestions) * 100) : 100;

            return (
              <div
                key={dom.id}
                className={`domain-card status-${dom.status} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDomainId(isSelected ? null : dom.id)}
              >
                <div className="domain-card-top">
                  <div className="domain-icon-wrap" style={{ color: dom.statusColor }}>
                    <IconComp size={18} />
                  </div>
                  <div className="domain-meta-titles">
                    <span className="domain-seq-number">Domain {dom.number}</span>
                    <h4 className="domain-title">{dom.title}</h4>
                  </div>
                  <span
                    className="domain-badge"
                    style={{
                      background: dom.status === 'attention' ? '#fee2e2' : dom.status === 'review' ? '#fef3c7' : '#dcfce7',
                      color: dom.statusColor
                    }}
                  >
                    {dom.statusLabel}
                  </span>
                </div>

                <div className="domain-coverage-bar-wrap">
                  <div className="domain-bar-track">
                    <div
                      className="domain-bar-fill"
                      style={{
                        width: `${pctCovered}%`,
                        backgroundColor: dom.statusColor
                      }}
                    />
                  </div>
                  <div className="domain-coverage-text">
                    <span>{dom.answeredCount} of {dom.totalQuestions} questions</span>
                    <span>YES: {dom.yesCount} • NO: {dom.noCount}</span>
                  </div>
                </div>

                {dom.highlights.length > 0 ? (
                  <div className="domain-highlights-box">
                    <span className="highlights-caption">Recorded Findings:</span>
                    <ul className="highlights-list">
                      {dom.highlights.slice(0, 2).map((h, i) => (
                        <li key={i}>{h.text}</li>
                      ))}
                      {dom.highlights.length > 2 && (
                        <li className="highlights-more">+{dom.highlights.length - 2} more answers</li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <div className="domain-cleared-caption">
                    ✓ No risk indicators reported
                  </div>
                )}

                {dom.note && (
                  <div className="domain-card-doctor-note">
                    <FileText size={12} color="#be123c" />
                    <span>Doctor Note: "{dom.note.length > 45 ? dom.note.slice(0, 45) + '...' : dom.note}"</span>
                  </div>
                )}

                {isSelected && (
                  <div className="domain-expanded-panel animate-fade-in">
                    {dom.flags.length > 0 && (
                      <div className="expanded-flags-list">
                        <strong>Clinical Guidelines:</strong>
                        {dom.flags.map(f => (
                          <div key={f.id} className="expanded-flag-entry">
                            <span className="entry-title">• {f.title}</span>
                            <p className="entry-detail">{f.detail}</p>
                            <span className="entry-source">Ref: {f.source}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {dom.note && (
                      <div className="expanded-note-entry">
                        <strong>Full Doctor's Clinical Note:</strong>
                        <p>"{dom.note}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────
          SECTION-WISE ANSWER ANALYTICS TABLE
          ────────────────────────────────────────────────── */}
      <div className="section-analytics-table-card">
        <div className="table-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Activity size={18} color="#e11d48" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Section-Wise Answer Analytics
            </h3>
          </div>
          <span className="table-header-sub">
            Calculated strictly from doctor-entered responses across all 12 FOGSI domains
          </span>
        </div>

        <div className="section-table-wrapper">
          <table className="section-analytics-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Assessment Section</th>
                <th style={{ textAlign: 'center' }}>Total Answered</th>
                <th style={{ textAlign: 'center' }}>YES</th>
                <th style={{ textAlign: 'center' }}>NO</th>
                <th style={{ textAlign: 'center' }}>NOT SURE</th>
                <th>Clinical Status</th>
                <th>Section Note</th>
              </tr>
            </thead>
            <tbody>
              {domainSummaries.map((sec) => (
                <tr key={sec.id}>
                  <td style={{ fontWeight: 800, color: '#64748b' }}>{sec.number}</td>
                  <td>
                    <strong style={{ color: 'var(--text-main)' }}>{sec.title}</strong>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>
                    {sec.answeredCount} / {sec.totalQuestions}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge-stat-yes">{sec.yesCount}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge-stat-no">{sec.noCount}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {sec.notSureCount > 0 ? (
                      <span className="badge-stat-not-sure">{sec.notSureCount}</span>
                    ) : (
                      <span style={{ color: '#cbd5e1' }}>0</span>
                    )}
                  </td>
                  <td>
                    <span
                      className="table-status-pill"
                      style={{
                        background: sec.status === 'attention' ? '#fee2e2' : sec.status === 'review' ? '#fef3c7' : '#dcfce7',
                        color: sec.statusColor
                      }}
                    >
                      {sec.statusLabel}
                    </span>
                  </td>
                  <td>
                    {sec.note ? (
                      <span className="table-note-snippet" title={sec.note}>
                        "{sec.note.length > 35 ? sec.note.slice(0, 35) + '...' : sec.note}"
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.8rem' }}>None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────
          4. ACTIONABLE CLINICAL CARE PLAN & PRESCRIPTIONS
          ────────────────────────────────────────────────── */}
      <div className="actionable-care-plan-section">
        <div className="care-plan-card">
          <div className="care-plan-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Stethoscope size={20} color="#e11d48" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>
                Actionable Preconception Care Plan (FOGSI Protocols)
              </h3>
            </div>
            <span className="care-plan-tag">Personalized for {patient?.name || 'Patient'}</span>
          </div>

          <div className="care-plan-grid">
            {/* Column 1: Folic Acid Prescription Protocol */}
            <div className="care-plan-column">
              <div className="column-title-box bg-rose-tint">
                <Pill size={16} color="#be123c" />
                <span>Folic Acid Prescription</span>
              </div>
              <div className="folic-prescription-card">
                <div className="folic-dose-headline">
                  <span className="folic-dose-num">{folicAcidGuidance.dose}</span>
                  <span className="folic-dose-badge" style={{ backgroundColor: folicAcidGuidance.badgeColor }}>
                    {folicAcidGuidance.type}
                  </span>
                </div>
                <p className="folic-dose-rationale">{folicAcidGuidance.rationale}</p>
                <div className="folic-protocol-ref">
                  Source: FOGSI Preconception Care Checklist #6 & E-Booklet p. 12
                </div>
              </div>

              {answers['consanguineous_marriage'] === 'yes' && (
                <div className="protocol-alert-banner alert-consanguinity">
                  <strong>⚠️ Consanguinity Protocol:</strong> Order couple Hemoglobin HPLC / Electrophoresis prior to conception. Offer formal genetic counselling for autosomal recessive risk.
                </div>
              )}
            </div>

            {/* Column 2: Recommended Laboratory Workup */}
            <div className="care-plan-column">
              <div className="column-title-box bg-blue-tint">
                <Activity size={16} color="#1d4ed8" />
                <span>Targeted Investigations Checklist</span>
              </div>
              <div className="investigations-checklist-box">
                {recommendedInvestigations.map((inv, idx) => (
                  <div key={idx} className={`investigation-item ${inv.priority}`}>
                    <div className="inv-checkbox-mock">
                      <Check size={12} color={inv.priority === 'high' ? '#e11d48' : '#059669'} />
                    </div>
                    <div className="inv-content">
                      <strong className="inv-name">{inv.name}</strong>
                      <span className="inv-reason">{inv.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Lifestyle & Vaccination Guidance */}
            <div className="care-plan-column">
              <div className="column-title-box bg-amber-tint">
                <Heart size={16} color="#b45309" />
                <span>Clinical Guidance & Safety</span>
              </div>
              <div className="guidance-items-stack">
                <div className="guidance-item">
                  <strong>Vaccine Safety Warning:</strong>
                  <p>If administering live attenuated vaccines (MMR / Rubella, Varicella), strictly advise deferring pregnancy for at least 4 weeks (28 days).</p>
                </div>
                <div className="guidance-item">
                  <strong>Pregnancy Timing & Spacing:</strong>
                  <p>Recommended inter-pregnancy interval is 18–24 months (minimum 6 months) to optimize perinatal and maternal outcomes.</p>
                </div>
                <div className="guidance-item">
                  <strong>Dental / Periodontal Care:</strong>
                  <p>Advise preconception dental checkup. Maternal periodontal disease is clinically linked to preterm birth and low birth weight.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────
          5. DOCTOR'S SECTION CLINICAL NOTES
          ────────────────────────────────────────────────── */}
      <div className="doctor-section-notes-shelf">
        <div className="shelf-header">
          <FileText size={18} color="#be123c" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#be123c' }}>
            Doctor's Consultation Notes (One Field Per Assessment Section)
          </h3>
        </div>
        {Object.values(normalizedSectionNotes).some(n => n && String(n).trim()) ? (
          <div className="shelf-notes-grid">
            {SECTIONS_META.map(sec => {
              const note = normalizedSectionNotes[sec.id];
              if (!note || !String(note).trim()) return null;
              return (
                <div key={sec.id} className="shelf-note-card">
                  <div className="shelf-note-title">🌸 {sec?.title?.en || sec.id}</div>
                  <div className="shelf-note-body">"{note}"</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ color: '#64748b', fontSize: '0.86rem', fontStyle: 'italic', padding: '0.5rem 0' }}>
            No specific section-level notes entered during this consultation.
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────
          COMPLETE ANSWER SUMMARY (ALL RECORDED ANSWERS)
          ────────────────────────────────────────────────── */}
      <div className="complete-answers-summary-card">
        <div className="answers-summary-header">
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Complete Answer Summary ({allAnswerList.length} Questions Answered)
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Detailed audit log of every individual question asked to the patient and the verbal response recorded by the clinician.
            </p>
          </div>

          <div className="answer-filters-bar">
            {[
              { key: 'all', label: `All (${allAnswerList.length})` },
              { key: 'yes', label: `YES (${analytics.yes})` },
              { key: 'no', label: `NO (${analytics.no})` },
              { key: 'not_sure', label: `NOT SURE (${analytics.not_sure})` }
            ].map(f => (
              <button
                key={f.key}
                type="button"
                className={`filter-btn ${answerFilter === f.key ? 'active' : ''}`}
                onClick={() => setAnswerFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="answers-list-container">
          {filteredAnswerList.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No answers match the selected filter.
            </div>
          ) : (
            <div className="answers-table-wrapper">
              <table className="answers-audit-table">
                <thead>
                  <tr>
                    <th style={{ width: '160px' }}>Section</th>
                    <th>Question Asked</th>
                    <th style={{ width: '180px' }}>Recorded Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnswerList.map(item => (
                    <tr key={item.qId}>
                      <td>
                        <span className="audit-section-tag">{item.sectionTitle}</span>
                      </td>
                      <td>
                        <div className="audit-q-text">{item.questionText}</div>
                        {item.source && <div className="audit-source">{item.source}</div>}
                      </td>
                      <td>
                        <span className={`audit-answer-badge ans-${item.answerValue}`}>
                          {item.answerDisplay}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────
          6. BOTTOM QUICK ACTIONS FOOTER
          ────────────────────────────────────────────────── */}
      <div className="assessment-visuals-footer btn-print-hide">
        <div className="footer-left-info">
          <CheckCircle2 size={16} color="#059669" />
          <span>
            Assessment data is securely recorded. Switch to the <strong>Full Clinical Checklist</strong> to enter physical exam findings and finalize consultation sign-off.
          </span>
        </div>

        <div className="footer-right-buttons">
          <button
            type="button"
            className="btn-footer-secondary"
            onClick={() => setIsJsonModalOpen(true)}
          >
            <Code size={15} />
            <span>View JSON</span>
          </button>

          <button
            type="button"
            className="btn-footer-secondary"
            onClick={() => {
              const payload = assessment?.jsonPayload || generateAssessmentJson({
                patient: patient,
                history: assessment?.history || [],
                answers: answers,
                sectionNotes: normalizedSectionNotes,
                assessmentDate: assessment?.isoDate || patient?.completedAt,
                assessmentStatus: 'completed'
              });
              downloadAssessmentJson(payload, patient?.name || 'patient');
            }}
          >
            <Download size={15} />
            <span>Download JSON</span>
          </button>

          <button
            type="button"
            className="btn-footer-primary"
            onClick={onSwitchToSummary}
          >
            <span>Proceed to Clinical Summary Checklist</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Structured Assessment JSON Modal */}
      {isJsonModalOpen && (
        <div className="json-modal-backdrop" onClick={() => setIsJsonModalOpen(false)}>
          <div className="json-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="json-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code size={18} color="#e11d48" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Assessment JSON Representation</h3>
              </div>
              <button
                className="btn-modal-close"
                onClick={() => setIsJsonModalOpen(false)}
                type="button"
              >
                ✕
              </button>
            </div>
            <div className="json-modal-body">
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                This standardized JSON contains actual patient details, verbal answers, section-level notes, date/time, and calculated analytics.
              </p>
              <pre className="json-pre-block">
                {JSON.stringify(
                  assessment?.jsonPayload || generateAssessmentJson({
                    patient: patient,
                    history: assessment?.history || [],
                    answers: answers,
                    sectionNotes: normalizedSectionNotes,
                    assessmentDate: assessment?.isoDate || patient?.completedAt,
                    assessmentStatus: 'completed'
                  }),
                  null,
                  2
                )}
              </pre>
            </div>
            <div className="json-modal-footer">
              <button
                className="btn-primary-lg"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.9rem' }}
                onClick={() => {
                  const payload = assessment?.jsonPayload || generateAssessmentJson({
                    patient: patient,
                    history: assessment?.history || [],
                    answers: answers,
                    sectionNotes: normalizedSectionNotes,
                    assessmentDate: assessment?.isoDate || patient?.completedAt,
                    assessmentStatus: 'completed'
                  });
                  downloadAssessmentJson(payload, patient?.name || 'patient');
                }}
                type="button"
              >
                <Download size={16} />
                <span>Download .JSON File</span>
              </button>
              <button
                className="btn-secondary-clinical"
                onClick={() => {
                  const payload = assessment?.jsonPayload || generateAssessmentJson({
                    patient: patient,
                    history: assessment?.history || [],
                    answers: answers,
                    sectionNotes: normalizedSectionNotes,
                    assessmentDate: assessment?.isoDate || patient?.completedAt,
                    assessmentStatus: 'completed'
                  });
                  navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
                  alert('Assessment JSON copied to clipboard!');
                }}
                type="button"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
