import React, { useState, useMemo, useEffect } from 'react';
import { UI_TRANSLATIONS } from '../data/translations';
import { generateClinicianFlags, QUESTIONS, SECTIONS_META } from '../data/fogsiQuestions';
import { formatAnswerValue } from '../utils/answerFormatter';
import { calculateAssessmentAnalytics, generateAssessmentJson, downloadAssessmentJson } from '../utils/assessmentJsonGenerator';
import AssessmentVisualisation from './AssessmentVisualisation';
import {
  Stethoscope,
  Printer,
  CheckSquare,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  FileText,
  User,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  ShieldAlert,
  Search,
  Filter,
  UserPlus,
  ArrowRight,
  Activity,
  Calendar,
  Phone,
  Shield,
  PlusCircle,
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  Check,
  Eye,
  Download,
  Code,
  X,
  HelpCircle
} from 'lucide-react';

export default function DoctorDashboard({
  patientsList,
  currentActivePatientId,
  initialTab = 'visualisation',
  justCompleted = false,
  onClearJustCompleted,
  onSelectPatient,
  onStartAssessment,
  onBackToChat,
  onOpenAddPatient,
  onUpdatePatient,
  activeDoctor
}) {
  // Navigation Tabs: 'visualisation' | 'dashboard' | 'patients' | 'summary' | 'reports'
  const [activeTab, setActiveTab] = useState(initialTab || 'visualisation');
  const [selectedPatientId, setSelectedPatientId] = useState(currentActivePatientId || patientsList[0]?.id);

  // Sync selected patient when currentActivePatientId prop changes
  useEffect(() => {
    if (currentActivePatientId) {
      setSelectedPatientId(currentActivePatientId);
    }
  }, [currentActivePatientId]);

  // Sync tab when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'new' | 'in_progress' | 'completed' | 'needs_review' | 'reviewed'

  // Examination State for active patient
  const [examState, setExamState] = useState({
    bp: '',
    height: '',
    weight: '',
    findings: ''
  });

  // Management Checklist state
  const [managementChecklist, setManagementChecklist] = useState({
    investigations: false,
    medications: false,
    vaccination: false,
    geneticCounselling: false,
    nutrition: false,
    lifestyle: false,
    specialistReferral: false,
    followUp: false,
    other: false
  });

  // Doctor's consultation notes & signoff state
  const [doctorNotesText, setDoctorNotesText] = useState('');
  const [newNoteInput, setNewNoteInput] = useState('');
  const [finalClassification, setFinalClassification] = useState(null); // 'routine' | 'review' | 'high_risk'
  const [checklistSigned, setChecklistSigned] = useState(false);
  const [signatureName, setSignatureName] = useState(activeDoctor?.name || 'Dr. Anita Joshi, MD');

  // Multi-consultation assessment selection & JSON modal
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  const activePatient = useMemo(() => {
    return patientsList.find(p => p.id === selectedPatientId) || patientsList[0];
  }, [patientsList, selectedPatientId]);

  // Current selected assessment for this patient (supports multi-consultation history)
  const currentAssessment = useMemo(() => {
    if (!activePatient) return null;
    if (activePatient.assessments && activePatient.assessments.length > 0) {
      if (selectedAssessmentId) {
        return activePatient.assessments.find(a => a.id === selectedAssessmentId) || activePatient.assessments[0];
      }
      return activePatient.assessments[0];
    }
    return null;
  }, [activePatient, selectedAssessmentId]);

  const answers = currentAssessment?.answers || activePatient?.answers || {};
  const questionNotes = currentAssessment?.questionNotes || activePatient?.questionNotes || {};

  // Analytics based ONLY on answers selected by the clinician/patient
  const patientAnalytics = useMemo(() => {
    return calculateAssessmentAnalytics(answers, currentAssessment?.history || []);
  }, [answers, currentAssessment]);

  // Extract section-level Doctor's Notes (ONE notes field per assessment section/page)
  const assessmentSectionNotes = useMemo(() => {
    const sNotes = currentAssessment?.sectionNotes || activePatient?.sectionNotes || {};
    const notesList = [];

    SECTIONS_META.forEach(sec => {
      const noteText = sNotes[sec.id] || (
        // Fallback to legacy question notes if present in assessment history
        currentAssessment?.history
          ?.filter(item => {
            const qDef = QUESTIONS.find(q => q.id === item.questionId) ||
              QUESTIONS.flatMap(q => q.followUps || []).find(sub => sub.id === item.questionId);
            return qDef && qDef.section === sec.id && item.note;
          })
          .map(i => i.note)
          .join('; ')
      );

      if (noteText && String(noteText).trim()) {
        notesList.push({
          sectionId: sec.id,
          sectionTitle: sec?.title?.en || sec.id,
          note: String(noteText).trim()
        });
      }
    });

    return notesList;
  }, [currentAssessment, activePatient]);

  // Calculate BMI automatically
  const calculatedBMI = useMemo(() => {
    const h = parseFloat(examState.height);
    const w = parseFloat(examState.weight);
    if (h > 50 && w > 20) {
      const hM = h / 100;
      const bmi = (w / (hM * hM)).toFixed(1);
      return bmi;
    }
    return null;
  }, [examState.height, examState.weight]);

  const flags = useMemo(() => {
    return activePatient ? generateClinicianFlags(answers) : [];
  }, [activePatient, answers]);

  const attentionFlags = flags.filter(f => f.level === 'attention');
  const reviewFlags = flags.filter(f => f.level === 'review');
  const optimalFlags = flags.filter(f => f.level === 'ok');

  // Dashboard metric calculations
  const totalPatients = patientsList.length;
  const assessmentsCompleted = patientsList.filter(p => p.status === 'Completed' || p.status === 'Reviewed' || p.status === 'Submitted' || (p.answers && Object.keys(p.answers).length > 0)).length;
  const awaitingReview = patientsList.filter(p => p.status === 'Needs Review' || p.status === 'Submitted').length;
  const needsAttention = patientsList.filter(p => generateClinicianFlags(p.answers || {}).some(f => f.level === 'attention')).length;

  // Filtered Patients List
  const filteredPatients = useMemo(() => {
    return patientsList.filter(p => {
      // Search
      const matchesSearch = searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.phone && p.phone.includes(searchQuery)) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter
      let matchesFilter = true;
      if (statusFilter === 'new') matchesFilter = p.status === 'New';
      else if (statusFilter === 'in_progress') matchesFilter = p.status === 'In Progress';
      else if (statusFilter === 'completed') matchesFilter = p.status === 'Completed';
      else if (statusFilter === 'needs_review') matchesFilter = p.status === 'Needs Review' || p.status === 'Submitted';
      else if (statusFilter === 'reviewed') matchesFilter = p.status === 'Reviewed' || p.status === 'Consultation Completed';

      return matchesSearch && matchesFilter;
    });
  }, [patientsList, searchQuery, statusFilter]);

  const handlePrint = () => {
    window.print();
  };

  const handleAddDoctorNote = () => {
    if (!newNoteInput.trim() || !activePatient) return;
    const newNote = {
      doctor: activeDoctor?.name || 'Dr. Anita Joshi, MD',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      text: newNoteInput.trim()
    };
    const updatedNotes = [newNote, ...(activePatient.notes || [])];
    if (onUpdatePatient) {
      onUpdatePatient({ ...activePatient, notes: updatedNotes });
    }
    setNewNoteInput('');
  };

  const handleCompleteConsultation = () => {
    setChecklistSigned(true);
    if (onUpdatePatient && activePatient) {
      onUpdatePatient({
        ...activePatient,
        status: 'Consultation Completed',
        clinicianClassification: finalClassification,
        managementPlan: {
          exam: examState,
          checklist: managementChecklist,
          doctorNotes: doctorNotesText,
          signature: signatureName,
          date: new Date().toLocaleDateString('en-GB')
        }
      });
    }
  };

  if (!activePatient) {
    return <div className="doctor-portal-container">No patient assessments available yet.</div>;
  }

  return (
    <div className="doctor-portal-container animate-fade-in">
      {/* Clinician Portal Header */}
      <div className="doctor-header-card">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Stethoscope size={24} color="#f43f5e" />
            <h1>Preconception Pre-Visit Clinician Portal</h1>
          </div>
          <p>
            FOGSI Safe Motherhood Guidelines • Dual Patient-Clinician Workflow
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} className="btn-print-hide">
          <button
            className="btn-secondary-clinical"
            onClick={onOpenAddPatient}
            type="button"
            id="btn-header-add-patient"
          >
            <UserPlus size={16} />
            <span>+ Add Patient</span>
          </button>

          <button
            className="btn-secondary-clinical"
            onClick={() => {
              const payload = currentAssessment?.jsonPayload || generateAssessmentJson({
                patient: activePatient,
                history: currentAssessment?.history || [],
                answers: answers,
                questionNotes: questionNotes,
                assessmentDate: currentAssessment?.isoDate || activePatient.completedAt,
                assessmentStatus: 'completed'
              });
              downloadAssessmentJson(payload, activePatient.name);
            }}
            type="button"
            title="Download assessment JSON representation"
          >
            <Download size={16} />
            <span>JSON</span>
          </button>

          <button
            className="btn-primary-lg"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', background: 'white', color: '#0f172a' }}
            onClick={handlePrint}
            type="button"
          >
            <Printer size={16} />
            <span>Print / PDF</span>
          </button>

          <button
            className="nav-pill-btn"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
            onClick={onBackToChat}
            type="button"
          >
            <span>Patient View</span>
          </button>
        </div>
      </div>

      {/* Top Clinical Navigation Tabs */}
      <div className="doctor-nav-tabs-bar btn-print-hide">
        <button
          className={`doctor-nav-tab ${activeTab === 'visualisation' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('visualisation');
            if (onClearJustCompleted) onClearJustCompleted();
          }}
          type="button"
          id="tab-btn-visualisation"
        >
          <BarChart3 size={16} />
          <span>Visual Assessment ({activePatient?.name || 'Patient'})</span>
          {justCompleted && <span className="tab-pill-badge pulse-dot">Just Completed</span>}
        </button>

        <button
          className={`doctor-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          type="button"
          id="tab-btn-dashboard"
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        <button
          className={`doctor-nav-tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
          type="button"
          id="tab-btn-summary"
        >
          <ClipboardList size={16} />
          <span>Pre-Visit Summary ({activePatient?.name || 'Patient'})</span>
        </button>

        <button
          className={`doctor-nav-tab ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
          type="button"
          id="tab-btn-patients"
        >
          <Users size={16} />
          <span>Patients ({patientsList.length})</span>
        </button>

        <button
          className={`doctor-nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
          type="button"
          id="tab-btn-reports"
        >
          <FileText size={16} />
          <span>FOGSI Guidelines</span>
        </button>
      </div>

      {/* VIEW: DEDICATED VISUAL ASSESSMENT REPORT */}
      {activeTab === 'visualisation' && (
        <AssessmentVisualisation
          patient={activePatient}
          assessment={currentAssessment}
          answers={answers}
          flags={flags}
          sectionNotes={currentAssessment?.sectionNotes || activePatient?.sectionNotes || {}}
          selectedAssessmentId={selectedAssessmentId || currentAssessment?.id}
          onSelectAssessment={setSelectedAssessmentId}
          onSwitchToSummary={() => setActiveTab('summary')}
          onStartNewAssessment={onStartAssessment}
          isRecentCompletion={justCompleted}
        />
      )}

      {/* VIEW A: DASHBOARD METRICS CARDS (Shown on Dashboard tab or top of patients) */}
      {(activeTab === 'dashboard' || activeTab === 'patients') && (
        <div className="dashboard-metrics-grid btn-print-hide animate-fade-in">
          <div className="metric-card">
            <div className="metric-icon-box bg-slate">
              <Users size={20} color="#475569" />
            </div>
            <div className="metric-content">
              <span className="metric-label">Today's Patients</span>
              <strong className="metric-value">{totalPatients}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box bg-emerald">
              <CheckCircle size={20} color="#059669" />
            </div>
            <div className="metric-content">
              <span className="metric-label">Assessments Completed</span>
              <strong className="metric-value">{assessmentsCompleted}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box bg-amber">
              <Clock size={20} color="#d97706" />
            </div>
            <div className="metric-content">
              <span className="metric-label">Awaiting Review</span>
              <strong className="metric-value">{awaitingReview}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box bg-rose">
              <AlertCircle size={20} color="#e11d48" />
            </div>
            <div className="metric-content">
              <span className="metric-label">Needs Attention</span>
              <strong className="metric-value">{needsAttention}</strong>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: PATIENTS LIST / SEARCH / FILTERS */}
      {(activeTab === 'dashboard' || activeTab === 'patients') && (
        <div className="doctor-patients-panel btn-print-hide animate-fade-in" style={{ marginBottom: '1.5rem' }}>
          <div className="search-filter-row">
            {/* Search */}
            <div className="search-input-box">
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search by patient name or phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="input-patient-search"
              />
            </div>

            {/* Status Filters */}
            <div className="filter-pills-stack">
              {[
                { key: 'all', label: 'All' },
                { key: 'new', label: 'New' },
                { key: 'in_progress', label: 'In Progress' },
                { key: 'completed', label: 'Completed' },
                { key: 'needs_review', label: 'Needs Review' },
                { key: 'reviewed', label: 'Reviewed' }
              ].map(flt => (
                <button
                  key={flt.key}
                  className={`filter-pill-btn ${statusFilter === flt.key ? 'active' : ''}`}
                  onClick={() => setStatusFilter(flt.key)}
                  type="button"
                >
                  {flt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Cards List */}
          <div className="patient-cards-grid">
            {filteredPatients.length === 0 ? (
              <div style={{ gridColumn: 'span 3', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No patients match the selected search or filter criteria.
              </div>
            ) : (
              filteredPatients.map(pt => {
                const ptFlags = generateClinicianFlags(pt.answers || {});
                const ptAttention = ptFlags.filter(f => f.level === 'attention').length;
                const ptReview = ptFlags.filter(f => f.level === 'review').length;
                const totalPtFlags = ptAttention + ptReview;
                const isSelected = pt.id === selectedPatientId;

                return (
                  <div
                    key={pt.id}
                    className={`doctor-patient-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedPatientId(pt.id);
                      if (onSelectPatient) onSelectPatient(pt.id);
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div className="pt-avatar">
                          <User size={18} color="#e11d48" />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: 0 }}>{pt.name}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {pt.id} • {pt.age ? `${pt.age}y` : '28y'} {pt.phone && `• ${pt.phone}`}
                          </span>
                        </div>
                      </div>

                      {pt.isDemo && (
                        <span className="demo-chip">DEMO</span>
                      )}
                    </div>

                    <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className={`status-pill status-${(pt.status || 'new').toLowerCase().replace(' ', '-')}`}>
                        {pt.status || 'Completed'}
                      </span>
                      <span className="time-pill">
                        {pt.completedAt || 'Recently'}
                      </span>
                    </div>

                    {/* Flags Summary Pill */}
                    <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                      {totalPtFlags > 0 ? (
                        <div style={{
                          padding: '0.4rem 0.65rem',
                          borderRadius: '6px',
                          background: ptAttention > 0 ? '#fee2e2' : '#fef3c7',
                          color: ptAttention > 0 ? '#991b1b' : '#92400e',
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }}>
                          {ptAttention > 0 ? '🔴' : '🟡'} {totalPtFlags} topic{totalPtFlags === 1 ? '' : 's'} for clinician review
                        </div>
                      ) : (
                        <div style={{
                          padding: '0.4rem 0.65rem',
                          borderRadius: '6px',
                          background: '#f0fdf4',
                          color: '#166534',
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }}>
                          🟢 Routine preconception (No flags)
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn-primary-lg"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', flex: 1, justifyContent: 'center' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatientId(pt.id);
                          setActiveTab('summary');
                        }}
                        type="button"
                      >
                        <Eye size={14} />
                        <span>View Summary</span>
                      </button>

                      <button
                        className="btn-secondary-clinical"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatientId(pt.id);
                          if (onStartAssessment) onStartAssessment(pt);
                          else if (onBackToChat) onBackToChat();
                        }}
                        type="button"
                        title="Open continuous clinical assessment"
                      >
                        <FileText size={13} color="#be123c" />
                        <span>Assessment</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW ON DASHBOARD TAB: ASSESSMENT VISUALISATION SPOTLIGHT */}
      {activeTab === 'dashboard' && (
        <div style={{ marginTop: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 0.5rem' }} className="btn-print-hide">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="#e11d48" />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                Assessment Visualisation Spotlight: <span style={{ color: '#be123c' }}>{activePatient?.name}</span>
              </h3>
            </div>
            <button
              type="button"
              className="btn-secondary-clinical"
              onClick={() => setActiveTab('visualisation')}
              style={{ fontSize: '0.85rem' }}
            >
              Open Dedicated Visual View →
            </button>
          </div>

          <AssessmentVisualisation
            patient={activePatient}
            assessment={currentAssessment}
            answers={answers}
            flags={flags}
            sectionNotes={currentAssessment?.sectionNotes || activePatient?.sectionNotes || {}}
            selectedAssessmentId={selectedAssessmentId || currentAssessment?.id}
            onSelectAssessment={setSelectedAssessmentId}
            onSwitchToSummary={() => setActiveTab('summary')}
            onStartNewAssessment={onStartAssessment}
            isRecentCompletion={justCompleted}
          />
        </div>
      )}

      {/* VIEW C: MAIN CLINICAL SUMMARY SHEET (Print-ready, complete FOGSI structure) */}
      {activeTab === 'summary' && (
        <div className="clinical-summary-sheet animate-fade-in">
          {/* DEMO BADGE IF DEMO PATIENT */}
          {activePatient.isDemo && (
            <div className="demo-data-banner">
              <span>⚠️ DEMO DATA — NOT A REAL PATIENT (Simulated for Evaluation & Training)</span>
            </div>
          )}

          {/* Letterhead */}
          <div className="summary-letterhead">
            <div>
              <div className="fogsi-brand-seal">
                FOGSI Safe Motherhood Committee • Preconception Care Initiative
              </div>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                PRECONCEPTION PRE-VISIT SUMMARY
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Source: FOGSI Preconception Care E-Booklet, Book 1 & Clinician Checklist
              </div>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.45rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 800,
                background: checklistSigned || activePatient.status === 'Consultation Completed' ? '#dcfce7' : '#fef3c7',
                color: checklistSigned || activePatient.status === 'Consultation Completed' ? '#166534' : '#92400e'
              }}>
                {checklistSigned || activePatient.status === 'Consultation Completed'
                  ? '✓ Consultation Completed & Signed'
                  : 'Pending Clinician Review'}
              </span>

              <button
                type="button"
                className="btn-secondary-clinical btn-print-hide"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                onClick={() => onStartAssessment ? onStartAssessment(activePatient) : onBackToChat && onBackToChat()}
                title="Open continuous clinical assessment for this patient"
              >
                <FileText size={13} color="#be123c" />
                <span>Open / Edit Clinical Assessment</span>
              </button>
            </div>
          </div>

          {/* Patient Metadata Grid */}
          <div className="summary-patient-meta">
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Patient</span>
              <strong>{activePatient.name}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Age</span>
              <strong>{activePatient.age ? `${activePatient.age} Years` : '28 Years'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Phone</span>
              <strong>{activePatient.phone || 'Not provided'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Assessment Date</span>
              <strong>{activePatient.completedAt || 'Today'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Language</span>
              <strong style={{ textTransform: 'uppercase' }}>{activePatient.language || 'English'}</strong>
            </div>
          </div>

          {/* DOCTOR'S INITIAL DESCRIPTION (AT THE VERY TOP AS REQUESTED) */}
          <div className="summary-doctor-description-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <FileText size={16} color="#be123c" />
              <strong style={{ fontSize: '0.9rem', color: '#be123c' }}>
                Doctor's Initial Description / Clinical Background:
              </strong>
              <span style={{ fontSize: '0.72rem', background: '#ffe4e6', color: '#be123c', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                Doctor-Only
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#4c0519', lineHeight: 1.5, margin: 0 }}>
              {activePatient.doctorDescription || 'No initial description recorded by clinician prior to assessment.'}
            </p>
          </div>

          {/* CONSULTATION ASSESSMENT SWITCHER (When the same patient returns) */}
          {activePatient.assessments && activePatient.assessments.length > 1 && (
            <div className="summary-assessment-switcher-card btn-print-hide">
              <div className="switcher-header">
                <Calendar size={16} color="#be123c" />
                <span>Returning Patient — Consultation History ({activePatient.assessments.length} Consultations Saved)</span>
              </div>
              <div className="switcher-pills-row">
                {activePatient.assessments.map((asm, idx) => (
                  <button
                    key={asm.id}
                    className={`assessment-version-pill ${(currentAssessment?.id === asm.id || (!selectedAssessmentId && idx === 0)) ? 'active' : ''}`}
                    onClick={() => setSelectedAssessmentId(asm.id)}
                    type="button"
                  >
                    <span className="pill-title">Consultation #{activePatient.assessments.length - idx}</span>
                    <span className="pill-date">{asm.date}</span>
                    <span className="pill-tag">{asm.status || 'Completed'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 1. PATIENT DETAILS → DASHBOARD ANALYTICS (BASED ONLY ON SELECTED ANSWERS) */}
          <div className="dashboard-assessment-analytics-panel">
            <div className="analytics-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Activity size={18} color="#e11d48" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Assessment Analytics (Based on Selected Answers)
                </h3>
              </div>

              {/* JSON export buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }} className="btn-print-hide">
                <button
                  className="btn-json-action"
                  onClick={() => {
                    const jsonPayload = currentAssessment?.jsonPayload || generateAssessmentJson({
                      patient: activePatient,
                      history: currentAssessment?.history || [],
                      answers: answers,
                      sectionNotes: currentAssessment?.sectionNotes || activePatient?.sectionNotes || {},
                      assessmentDate: currentAssessment?.isoDate || activePatient.completedAt,
                      assessmentStatus: 'completed'
                    });
                    downloadAssessmentJson(jsonPayload, activePatient.name);
                  }}
                  type="button"
                  title="Download assessment JSON representation"
                >
                  <Download size={14} />
                  <span>Download JSON</span>
                </button>

                <button
                  className="btn-json-action"
                  onClick={() => setIsJsonModalOpen(true)}
                  type="button"
                  title="View JSON format"
                >
                  <Code size={14} />
                  <span>View JSON</span>
                </button>
              </div>
            </div>

            {/* Analytics Metric Tiles */}
            <div className="analytics-tiles-grid">
              <div className="analytics-tile">
                <span className="tile-value">{patientAnalytics.total_answered}</span>
                <span className="tile-label">Total Answered</span>
              </div>
              <div className="analytics-tile tile-yes">
                <span className="tile-value">
                  <Check size={16} strokeWidth={3} />
                  {patientAnalytics.yes}
                </span>
                <span className="tile-label">YES Answers</span>
              </div>
              <div className="analytics-tile tile-no">
                <span className="tile-value">
                  <X size={16} strokeWidth={3} />
                  {patientAnalytics.no}
                </span>
                <span className="tile-label">NO Answers</span>
              </div>
              <div className="analytics-tile tile-not-sure">
                <span className="tile-value">
                  <HelpCircle size={16} />
                  {patientAnalytics.not_sure}
                </span>
                <span className="tile-label">NOT SURE Answers</span>
              </div>
              <div className="analytics-tile tile-flagged">
                <span className="tile-value">{patientAnalytics.flagged}</span>
                <span className="tile-label">Clinical Flags</span>
              </div>
            </div>

            {/* Section-Wise Answer Summary */}
            {patientAnalytics.section_summary && patientAnalytics.section_summary.length > 0 && (
              <div className="section-summary-breakdown">
                <div className="breakdown-title">Section-Wise Answer Summary</div>
                <div className="breakdown-grid">
                  {patientAnalytics.section_summary.map((sec) => (
                    <div key={sec.section_id} className="breakdown-card">
                      <div className="breakdown-sec-title">{sec.section_title}</div>
                      <div className="breakdown-sec-stats">
                        <span>Total: <strong>{sec.total_answered}</strong></span>
                        <span className="badge-yes">YES: {sec.yes}</span>
                        <span className="badge-no">NO: {sec.no}</span>
                        {sec.not_sure > 0 && (
                          <span className="badge-not-sure">NOT SURE: {sec.not_sure}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. DOCTOR'S SECTION NOTES (ONLY SHOWN IF NOTES EXIST FOR AT LEAST ONE SECTION) */}
          {assessmentSectionNotes.length > 0 && (
            <div className="dashboard-assessment-notes-panel">
              <div className="notes-panel-header">
                <FileText size={18} color="#be123c" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#be123c' }}>
                  Doctor's Notes (By Assessment Section)
                </h3>
                <span className="notes-count-tag">
                  {assessmentSectionNotes.length} {assessmentSectionNotes.length === 1 ? 'Section Note' : 'Section Notes'}
                </span>
              </div>
              <div className="assessment-notes-grid">
                {assessmentSectionNotes.map((item, idx) => (
                  <div key={idx} className="assessment-note-card">
                    <div className="note-card-top">
                      <span className="note-q-text" style={{ fontWeight: 700, color: '#be123c' }}>
                        🌸 {item.sectionTitle}
                      </span>
                    </div>
                    <div className="note-card-content">
                      <div className="note-caption">Doctor's Clinical Note:</div>
                      <div className="note-body">"{item.note}"</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: TOPICS FLAGGED FOR CLINICIAN REVIEW */}
          <div className="flags-board" style={{ marginTop: '1.5rem' }}>
            <div className="flags-board-title">
              <AlertCircle size={20} color="#e11d48" />
              <span>TOPICS FLAGGED FOR CLINICIAN REVIEW</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                {attentionFlags.length} Important Attention • {reviewFlags.length} Clinician Review
              </span>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem 0.9rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '1rem'
            }}>
              <strong>Clinical Flag Principle:</strong> Flags are automated clinical reminders mapped from patient responses. A reported finding does not constitute a diagnosis or automatically classify the patient as high-risk. The clinician makes the final clinical assessment.
            </div>

            {flags.length === 0 ? (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle size={18} />
                <span>🟢 No elevated risk flags reported. Routine preconception counselling and standard folic acid recommended.</span>
              </div>
            ) : (
              flags.map((flag) => (
                <div key={flag.id} className={`flag-alert-card ${flag.level}`}>
                  <div className="flag-title-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {flag.level === 'attention' ? '🔴' : (flag.level === 'review' ? '🟡' : '🟢')}
                      <span>{flag.title}</span>
                    </span>
                    <span className="flag-badge">
                      {flag.level === 'attention' ? 'Important Attention' : (flag.level === 'review' ? 'Clinician Review' : 'Optimal')}
                    </span>
                  </div>
                  <p className="flag-detail-text">{flag.detail}</p>
                  <div className="flag-source-ref">
                    Reference: {flag.source}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CLEAR SEPARATION: PATIENT-REPORTED INFORMATION VS CLINICIAN ASSESSMENT */}
          <div className="patient-vs-clinician-divider">
            <div className="pvsc-label-left">
              <span>PATIENT-REPORTED INFORMATION (12 FOGSI CLINICAL DOMAINS)</span>
            </div>
            <div className="pvsc-line" />
          </div>

          {/* 1. PREGNANCY INTENTION */}
          <div className="summary-section-block">
            <h4 className="summary-sec-heading">1. PREGNANCY INTENTION</h4>
            <div className="summary-data-grid">
              <div className="data-box">
                <span className="data-lbl">Planning Pregnancy:</span>
                <strong>{formatAnswerValue(answers['planning_pregnancy'])}</strong>
                {answers['pregnancy_timeframe'] && <span> • Timeframe: {formatAnswerValue(answers['pregnancy_timeframe'])}</span>}
              </div>
            </div>
          </div>

          {/* 2. OBSTETRIC HISTORY (SMART BRANCHED) */}
          <div className="summary-section-block">
            <h4 className="summary-sec-heading">2. OBSTETRIC HISTORY</h4>
            <div className="summary-data-grid">
              <div className="data-box">
                <span className="data-lbl">Previous Pregnancy:</span>
                <strong>{answers['previous_pregnancy'] === 'yes' ? 'YES (Multigravida)' : 'NO (Nulliparous / First Pregnancy)'}</strong>
              </div>

              {answers['previous_pregnancy'] === 'yes' && (
                <>
                  <div className="data-box">
                    <span className="data-lbl">Number of Pregnancies:</span>
                    <strong>{formatAnswerValue(answers['number_of_pregnancies'])}</strong>
                  </div>

                  <div className="data-box">
                    <span className="data-lbl">History of Miscarriages:</span>
                    <strong>{formatAnswerValue(answers['history_miscarriages'])}</strong>
                    {answers['miscarriage_type'] && <span> ({formatAnswerValue(answers['miscarriage_type'])})</span>}
                    {answers['miscarriage_complications'] && <span> • Complications: {formatAnswerValue(answers['miscarriage_complications'])}</span>}
                  </div>

                  <div className="data-box">
                    <span className="data-lbl">Ectopic Pregnancy:</span>
                    <strong>{formatAnswerValue(answers['history_ectopic'])}</strong>
                    {answers['ectopic_details'] && <span> ({answers['ectopic_details']})</span>}
                  </div>

                  <div className="data-box">
                    <span className="data-lbl">Premature Labour (&lt; 37w):</span>
                    <strong>{formatAnswerValue(answers['history_premature_labour'])}</strong>
                  </div>

                  <div className="data-box">
                    <span className="data-lbl">Congenital / Birth Defects:</span>
                    <strong>{formatAnswerValue(answers['history_birth_defects'])}</strong>
                    {answers['birth_defect_details'] && <span> • Details: "{answers['birth_defect_details']}"</span>}
                  </div>

                  <div className="data-box">
                    <span className="data-lbl">Prior Deliveries:</span>
                    <strong>{formatAnswerValue(answers['prior_deliveries'])}</strong>
                    {answers['delivery_interval'] && <span> • Interval: {formatAnswerValue(answers['delivery_interval'])}</span>}
                    {answers['delivery_complications'] && <span> • Complications: {formatAnswerValue(answers['delivery_complications'])}</span>}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 3. MARITAL HISTORY & CONSANGUINITY */}
          <div className="summary-section-block">
            <h4 className="summary-sec-heading">3. MARITAL HISTORY</h4>
            <div className="summary-data-grid">
              <div className="data-box">
                <span className="data-lbl">Years Married:</span>
                <strong>
                  {activePatient.yearsMarried !== undefined && activePatient.yearsMarried !== ''
                    ? `${activePatient.yearsMarried} Year${activePatient.yearsMarried === 1 ? '' : 's'}`
                    : (activePatient.marriageDate ? activePatient.marriageDate : 'Not specified')}
                </strong>
              </div>

              <div className="data-box">
                <span className="data-lbl">Consanguineous Union:</span>
                <strong>{answers['consanguineous_marriage'] === 'yes' ? 'YES (Blood relation reported)' : 'No'}</strong>
                {answers['consanguinity_relationship'] && <span> • Relationship: {answers['consanguinity_relationship']}</span>}
              </div>

              <div className="data-box">
                <span className="data-lbl">Previous Marriage History:</span>
                <strong>
                  {answers['marital_previous_marriage'] === 'yes' || activePatient.previousMarriage === 'yes'
                    ? 'YES (Previous marriage reported)'
                    : 'No history of previous marriage or children/pregnancy from previous partner'}
                </strong>
                {answers['prev_partner_counts'] && <span> • Previous partner children/pregnancies: {answers['prev_partner_counts']}</span>}
              </div>
            </div>
          </div>

          {/* 4. MEDICAL HISTORY */}
          <div className="summary-section-block">
            <h4 className="summary-sec-heading">4. MEDICAL HISTORY</h4>
            <div className="summary-data-grid">
              <div className="data-box">
                <span className="data-lbl">Diabetes Mellitus:</span>
                <strong>{formatAnswerValue(answers['medical_diabetes'])}</strong>
                {answers['diabetes_duration'] && <span> • Duration: {formatAnswerValue(answers['diabetes_duration'])}</span>}
                {answers['diabetes_treatment'] && <span> • Rx: {formatAnswerValue(answers['diabetes_treatment'])}</span>}
                {answers['diabetes_hba1c'] && <span style={{ color: '#991b1b', fontWeight: 700 }}> • HbA1c: {formatAnswerValue(answers['diabetes_hba1c'])}</span>}
              </div>

              <div className="data-box">
                <span className="data-lbl">Chronic Hypertension:</span>
                <strong>{formatAnswerValue(answers['medical_hypertension'])}</strong>
                {answers['htn_medications'] && <span> • Daily Rx: {formatAnswerValue(answers['htn_medications'])}</span>}
                {answers['htn_latest_bp'] && <span> • Typical BP: {formatAnswerValue(answers['htn_latest_bp'])}</span>}
              </div>

              <div className="data-box">
                <span className="data-lbl">Thyroid Disorder:</span>
                <strong>{formatAnswerValue(answers['medical_thyroid'])}</strong>
                {answers['thyroid_type'] && <span> ({formatAnswerValue(answers['thyroid_type'])})</span>}
                {answers['thyroid_medication'] === 'yes' && <span> • On daily medication</span>}
              </div>

              <div className="data-box">
                <span className="data-lbl">Epilepsy / Convulsions:</span>
                <strong>{formatAnswerValue(answers['medical_epilepsy'])}</strong>
                {answers['epilepsy_medication'] && <span> • Rx: {answers['epilepsy_medication']}</span>}
              </div>

              <div className="data-box">
                <span className="data-lbl">Cardiac / Valve Disease:</span>
                <strong>{formatAnswerValue(answers['medical_cardiac'])}</strong>
              </div>

              <div className="data-box">
                <span className="data-lbl">Renal / Kidney Disease:</span>
                <strong>{formatAnswerValue(answers['medical_renal'])}</strong>
              </div>

              <div className="data-box">
                <span className="data-lbl">Autoimmune (SLE/RA):</span>
                <strong>{formatAnswerValue(answers['medical_autoimmune'])}</strong>
              </div>

              <div className="data-box">
                <span className="data-lbl">Periodontal Gum Disease:</span>
                <strong>{formatAnswerValue(answers['medical_periodontal'])}</strong>
              </div>
            </div>
          </div>

          {/* 5. SURGICAL HISTORY */}
          <div className="summary-section-block">
            <h4 className="summary-sec-heading">5. SURGICAL HISTORY</h4>
            <div className="summary-data-grid">
              <div className="data-box">
                <span className="data-lbl">Bariatric (Weight Loss) Surgery:</span>
                <strong>{formatAnswerValue(answers['bariatric_surgery'])}</strong>
                {answers['bariatric_interval'] && <span> • Interval: {formatAnswerValue(answers['bariatric_interval'])}</span>}
              </div>
              <div className="data-box">
                <span className="data-lbl">Prior Surgeries:</span>
                <strong>{formatAnswerValue(answers['prior_surgeries'])}</strong>
                {answers['surgery_details'] && <span> • Details: "{answers['surgery_details']}"</span>}
              </div>
            </div>
          </div>

          {/* 6. MENSTRUAL HISTORY */}
          <div className="summary-section-block">
            <h4 className="summary-sec-heading">6. MENSTRUAL HISTORY</h4>
            <div className="summary-data-grid">
              <div className="data-box">
                <span className="data-lbl">Menstrual Regularity (24–35d):</span>
                <strong>{formatAnswerValue(answers['menstrual_regularity'])}</strong>
              </div>
              <div className="data-box">
                <span className="data-lbl">Cervical Pap Screening (&lt; 3y):</span>
                <strong>{formatAnswerValue(answers['cervical_screening'])}</strong>
              </div>
            </div>
          </div>

          {/* 7. MEDICATIONS & FOLIC ACID (CLEARLY SEPARATED) */}
          <div className="summary-section-block">
            <h4 className="summary-sec-heading">7. MEDICATIONS & PRECONCEPTION SUPPLEMENTATION</h4>
            <div className="summary-data-grid">
              <div className="data-box">
                <span className="data-lbl">Current Medications / Supplements:</span>
                <strong>{answers['taking_medications'] === 'yes' ? (answers['medication_names'] || 'Yes, reported') : 'None reported'}</strong>
              </div>

              <div className="data-box" style={{ background: answers['folic_acid_status'] === 'yes' ? '#f0fdf4' : '#fffbeb', border: answers['folic_acid_status'] === 'yes' ? '1px solid #bbf7d0' : '1px solid #fde68a' }}>
                <span className="data-lbl">Folic Acid Supplementation:</span>
                {answers['folic_acid_status'] === 'yes' ? (
                  <strong style={{ color: '#166534' }}>
                    Active ({formatAnswerValue(answers['folic_acid_dose']) || 'Standard 400–800 μg'})
                  </strong>
                ) : (
                  <strong style={{ color: '#92400e' }}>
                    Not currently taking daily folic acid — clinician initiation recommended
                  </strong>
                )}
              </div>
            </div>
          </div>

          {/* 8. FAMILY / GENETIC HISTORY */}
          <div className="summary-section-block">
            <h4 className="summary-sec-heading">8. FAMILY / GENETIC HISTORY</h4>
            <div className="summary-data-grid">
              <div className="data-box">
                <span className="data-lbl">Family Genetic Conditions (Thalassemia/Sickle Cell):</span>
                <strong>{formatAnswerValue(answers['family_genetic'])}</strong>
                {answers['genetic_condition_details'] && <span> • Details: "{answers['genetic_condition_details']}"</span>}
              </div>
            </div>
          </div>

          {/* 9. LIFESTYLE & SUBSTANCES */}
          <div className="summary-section-block">
            <h4 className="summary-sec-heading">9. LIFESTYLE & SUBSTANCES (BOTH PARTNERS)</h4>
            <div className="summary-data-grid">
              <div className="data-box">
                <span className="data-lbl">Tobacco Use:</span>
                <strong>{formatAnswerValue(answers['tobacco_use'])}</strong>
              </div>
              <div className="data-box">
                <span className="data-lbl">Alcohol Preconception:</span>
                <strong>{formatAnswerValue(answers['alcohol_use'])}</strong>
              </div>
              <div className="data-box">
                <span className="data-lbl">Caffeine Daily:</span>
                <strong>{formatAnswerValue(answers['caffeine_intake'])}</strong>
              </div>
            </div>
          </div>

          {/* 10. ENVIRONMENTAL EXPOSURES */}
          <div className="summary-section-block">
            <h4 className="summary-sec-heading">10. ENVIRONMENTAL EXPOSURES</h4>
            <div className="summary-data-grid">
              <div className="data-box">
                <span className="data-lbl">Occupational / Environmental Hazards:</span>
                <strong>{formatAnswerValue(answers['environmental_hazards'])}</strong>
                {answers['hazard_types'] && <span> • Types: {formatAnswerValue(answers['hazard_types'])}</span>}
              </div>
            </div>
          </div>

          {/* 11. IMMUNIZATION & INFECTIONS */}
          <div className="summary-section-block">
            <h4 className="summary-sec-heading">11. IMMUNIZATION & INFECTION SCREENING</h4>
            <div className="summary-data-grid">
              <div className="data-box">
                <span className="data-lbl">Rubella (MMR):</span>
                <strong>{formatAnswerValue(answers['tested_rubella'])}</strong>
              </div>
              <div className="data-box">
                <span className="data-lbl">Chickenpox (Varicella):</span>
                <strong>{formatAnswerValue(answers['tested_varicella'])}</strong>
              </div>
              <div className="data-box">
                <span className="data-lbl">Hepatitis B / HIV / Syphilis:</span>
                <strong>{formatAnswerValue(answers['tested_hepb_hiv'])}</strong>
              </div>
              <div className="data-box">
                <span className="data-lbl">Tuberculosis History:</span>
                <strong>{formatAnswerValue(answers['history_tuberculosis'])}</strong>
              </div>
            </div>
          </div>

          {/* 12. MENTAL HEALTH & PSYCHOSOCIAL */}
          <div className="summary-section-block">
            <h4 className="summary-sec-heading">12. MENTAL HEALTH & PSYCHOSOCIAL SAFETY</h4>
            <div className="summary-data-grid">
              <div className="data-box">
                <span className="data-lbl">Depression / Anxiety Screen:</span>
                <strong>{formatAnswerValue(answers['mental_health_history'])}</strong>
                {answers['psychiatric_medications'] === 'yes' && <span> • Taking psychiatric medication</span>}
              </div>
              <div className="data-box">
                <span className="data-lbl">Prior Perinatal Mood Episode:</span>
                <strong>{formatAnswerValue(answers['perinatal_mental_history'])}</strong>
              </div>
              <div className="data-box">
                <span className="data-lbl">Relationship Safety & Support:</span>
                <strong>{formatAnswerValue(answers['stress_safety'])}</strong>
              </div>
            </div>
          </div>

          {/* 13. RECOMMENDED INVESTIGATIONS */}
          <div className="summary-section-block" style={{ background: '#fdf4ff', border: '1px solid #f5d0fe' }}>
            <h4 className="summary-sec-heading" style={{ color: '#86198f' }}>
              <BookmarkCheck size={16} />
              <span>RECOMMENDED PRECONCEPTION LABORATORY INVESTIGATIONS (FOGSI Checklist #5)</span>
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#701a75', lineHeight: 1.6, margin: 0 }}>
              • Complete Blood Count (CBC) with peripheral smear (anaemia screening)<br />
              • Blood Grouping and Rh typing<br />
              • Fasting Blood Sugar / HbA1c (Target &lt; 6.5%)<br />
              • Thyroid Stimulating Hormone (TSH)<br />
              • Urine routine and microscopic examination<br />
              • Serology: Rubella IgG, HIV, HBsAg, VDRL<br />
              • Thalassemia Carrier Screening (Hb HPLC) — mandatory if consanguineous or family history
            </p>
          </div>

          {/* PART B: CLINICIAN ASSESSMENT & STRUCTURED MANAGEMENT PLAN */}
          <div className="patient-vs-clinician-divider" style={{ marginTop: '2.5rem' }}>
            <div className="pvsc-label-left" style={{ background: '#be123c' }}>
              <span>CLINICIAN ASSESSMENT & STRUCTURED MANAGEMENT PLAN</span>
            </div>
            <div className="pvsc-line" style={{ background: '#be123c' }} />
          </div>

          <div className="doctor-management-plan-card">
            {/* 1. Examination Findings */}
            <div className="management-sub-block">
              <h4 className="management-sub-title">1. Clinical Examination Findings</h4>
              <div className="exam-inputs-grid">
                <div className="exam-input-field">
                  <label>Blood Pressure (mmHg)</label>
                  <input
                    type="text"
                    placeholder="e.g. 120/80"
                    value={examState.bp}
                    onChange={(e) => setExamState({ ...examState, bp: e.target.value })}
                  />
                </div>

                <div className="exam-input-field">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    placeholder="e.g. 158"
                    value={examState.height}
                    onChange={(e) => setExamState({ ...examState, height: e.target.value })}
                  />
                </div>

                <div className="exam-input-field">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 56"
                    value={examState.weight}
                    onChange={(e) => setExamState({ ...examState, weight: e.target.value })}
                  />
                </div>

                <div className="exam-input-field">
                  <label>BMI (Auto-calculated)</label>
                  <input
                    type="text"
                    value={calculatedBMI ? `${calculatedBMI} kg/m²` : 'Enter Ht & Wt'}
                    readOnly
                    style={{ background: '#f1f5f9', fontWeight: 700 }}
                  />
                </div>

                <div className="exam-input-field" style={{ gridColumn: 'span 2' }}>
                  <label>Relevant Systemic / Pelvic Examination Findings</label>
                  <input
                    type="text"
                    placeholder="e.g. Thyroid non-palpable, S1 S2 normal, chest clear, no pedal edema..."
                    value={examState.findings}
                    onChange={(e) => setExamState({ ...examState, findings: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 2. Management Plan Checklist */}
            <div className="management-sub-block">
              <h4 className="management-sub-title">2. Management Checklist Discussed</h4>
              <div className="management-checkboxes-grid">
                {[
                  { key: 'investigations', label: 'Investigations ordered (CBC, TSH, Hb HPLC)' },
                  { key: 'medications', label: 'Medication reviewed & teratogens stopped/switched' },
                  { key: 'vaccination', label: 'Vaccination discussed (Rubella, Varicella, Hep B)' },
                  { key: 'geneticCounselling', label: 'Genetic counselling discussed (Consanguinity / Carrier)' },
                  { key: 'nutrition', label: 'Nutrition & Folic Acid counselling provided' },
                  { key: 'lifestyle', label: 'Lifestyle & substance cessation counselling (Both partners)' },
                  { key: 'specialistReferral', label: 'Specialist referral arranged (Endocrinology / Cardiology)' },
                  { key: 'followUp', label: 'Follow-up consultation planned' },
                  { key: 'other', label: 'Other clinical interventions documented' }
                ].map(item => (
                  <label key={item.key} className="mgmt-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!managementChecklist[item.key]}
                      onChange={(e) => setManagementChecklist({ ...managementChecklist, [item.key]: e.target.checked })}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Doctor's Notes Log & New Note Form */}
            <div className="management-sub-block">
              <h4 className="management-sub-title">3. Doctor's Consultation Notes</h4>
              
              {/* Existing Doctor Notes */}
              {activePatient.notes && activePatient.notes.length > 0 && (
                <div className="doc-notes-history-list" style={{ marginBottom: '1rem' }}>
                  {activePatient.notes.map((n, idx) => (
                    <div key={idx} className="doc-note-bubble">
                      <div className="doc-note-header">
                        <strong>{n.doctor}</strong> • <span>{n.date}</span>
                      </div>
                      <p className="doc-note-text">{n.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="add-note-inline-box">
                <textarea
                  rows={3}
                  placeholder="Document specific consultation notes, prescription changes, ultrasound findings, or personalized guidance..."
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-secondary-clinical"
                  style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                  onClick={handleAddDoctorNote}
                  disabled={!newNoteInput.trim()}
                >
                  <PlusCircle size={15} />
                  <span>Add Note</span>
                </button>
              </div>
            </div>

            {/* 4. Final Clinical Classification (DOCTOR SELECTS, NOT AUTOMATED) */}
            <div className="management-sub-block">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Shield size={16} color="var(--primary-600)" />
                <h4 className="management-sub-title" style={{ margin: 0 }}>
                  4. Final Clinician Preconception Classification *
                </h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                The application does NOT automatically classify patient risk. The clinician selects the final category based on comprehensive evaluation.
              </p>

              <div className="classification-options-grid">
                <button
                  type="button"
                  className={`classification-btn routine ${finalClassification === 'routine' ? 'active' : ''}`}
                  onClick={() => setFinalClassification('routine')}
                >
                  <span className="clf-badge">🟢 Category 1</span>
                  <strong>Routine / Low Concern</strong>
                  <span className="clf-desc">Standard preconception advice, routine baseline bloods, standard 400 μg folic acid.</span>
                </button>

                <button
                  type="button"
                  className={`classification-btn review ${finalClassification === 'review' ? 'active' : ''}`}
                  onClick={() => setFinalClassification('review')}
                >
                  <span className="clf-badge">🟡 Category 2</span>
                  <strong>Requires Further Review</strong>
                  <span className="clf-desc">Chronic condition requiring optimization (e.g. TSH/BP), consanguinity, or vaccine deferral.</span>
                </button>

                <button
                  type="button"
                  className={`classification-btn high_risk ${finalClassification === 'high_risk' ? 'active' : ''}`}
                  onClick={() => setFinalClassification('high_risk')}
                >
                  <span className="clf-badge">🔴 Category 3</span>
                  <strong>High-Risk / Specialist Management</strong>
                  <span className="clf-desc">Uncontrolled diabetes, cardiac disease, prior birth defect, recurrent loss, or genetic carrier.</span>
                </button>
              </div>
            </div>

            {/* 5. Final Completion & Sign-off */}
            <div className="management-sub-block signoff-section">
              <label className="signoff-checkbox-label">
                <input
                  type="checkbox"
                  checked={checklistSigned}
                  onChange={(e) => setChecklistSigned(e.target.checked)}
                />
                <span>
                  Checklist completed and discussed with patient/couple (FOGSI Checklist Item #12)
                </span>
              </label>

              <div className="signoff-signature-row">
                <div className="signature-field">
                  <label>Doctor Signature / Name:</label>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                  />
                </div>

                <div className="signature-field">
                  <label>Date:</label>
                  <input
                    type="text"
                    value={new Date().toLocaleDateString('en-GB')}
                    readOnly
                    style={{ background: '#f8fafc' }}
                  />
                </div>

                <div className="signature-field" style={{ alignSelf: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn-primary-lg"
                    style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
                    onClick={handleCompleteConsultation}
                    disabled={!finalClassification || !checklistSigned}
                  >
                    <Check size={16} />
                    <span>Complete Consultation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW D: FOGSI GUIDELINES REFERENCE REPORT TAB */}
      {activeTab === 'reports' && (
        <div className="doctor-guidelines-report-tab animate-fade-in">
          <div className="guidelines-card">
            <h2>FOGSI Safe Motherhood Committee Guidelines References</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Standard clinical protocols extracted from FOGSI Preconception Care E-Booklet, Book 1 & Clinician Checklist.
            </p>

            <div className="guidelines-accordion-stack">
              <div className="guideline-doc-item">
                <h4>Checklist Item #1: Pregnancy Timing & Spacing</h4>
                <p>Ideal inter-pregnancy interval is 18–24 months (minimum 6 months). Wait 12–24 months post-bariatric surgery until rapid catabolic phase stabilizes.</p>
              </div>

              <div className="guideline-doc-item">
                <h4>Checklist #4A: Glycaemic Target in Pre-gestational Diabetes</h4>
                <p>Maintain HbA1c &lt; 6.5% prior to conception. Reduces major congenital malformation rates from 10% down to background 2–3%.</p>
              </div>

              <div className="guideline-doc-item">
                <h4>Checklist #4C: Consanguinity & Thalassemia Carrier Screening</h4>
                <p>Thalassemia carrier screening (Hb HPLC) is of utmost importance in high prevalence communities and consanguineous marriages.</p>
              </div>

              <div className="guideline-doc-item">
                <h4>Checklist #6: Folic Acid Supplementation Protocol</h4>
                <p>Standard risk: 400–800 μg/day starting ≥ 1 month prior to conception.<br />High risk (diabetes, epilepsy, prior NTD, BMI &gt; 30): 5 mg/day starting 1–3 months prior.</p>
              </div>

              <div className="guideline-doc-item">
                <h4>Checklist #8: Live Vaccines Pregnancy Deferral</h4>
                <p>MMR (Rubella) and Varicella are live attenuated vaccines. Advise strictly avoiding pregnancy for at least 4 weeks (28 days) following administration.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JSON Viewer Modal for Ollama and Clinical Record Export */}
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
                This standardized JSON contains patient details, questions, answers, notes, and analytics ready for consultation records or downstream Ollama document generation.
              </p>
              <pre className="json-pre-block">
                {JSON.stringify(
                  currentAssessment?.jsonPayload || generateAssessmentJson({
                    patient: activePatient,
                    history: currentAssessment?.history || [],
                    answers: answers,
                    sectionNotes: currentAssessment?.sectionNotes || activePatient?.sectionNotes || {},
                    assessmentDate: currentAssessment?.isoDate || activePatient.completedAt,
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
                  const payload = currentAssessment?.jsonPayload || generateAssessmentJson({
                    patient: activePatient,
                    history: currentAssessment?.history || [],
                    answers: answers,
                    sectionNotes: currentAssessment?.sectionNotes || activePatient?.sectionNotes || {},
                    assessmentDate: currentAssessment?.isoDate || activePatient.completedAt,
                    assessmentStatus: 'completed'
                  });
                  downloadAssessmentJson(payload, activePatient.name);
                }}
                type="button"
              >
                <Download size={16} />
                <span>Download .JSON File</span>
              </button>
              <button
                className="btn-secondary-clinical"
                onClick={() => {
                  const payload = currentAssessment?.jsonPayload || generateAssessmentJson({
                    patient: activePatient,
                    history: currentAssessment?.history || [],
                    answers: answers,
                    sectionNotes: currentAssessment?.sectionNotes || activePatient?.sectionNotes || {},
                    assessmentDate: currentAssessment?.isoDate || activePatient.completedAt,
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
