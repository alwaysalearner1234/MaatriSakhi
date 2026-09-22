import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { QUESTIONS, SECTIONS_META } from './data/fogsiQuestions';
import { UI_TRANSLATIONS, LANGUAGES } from './data/translations';
import { DEMO_PATIENTS } from './data/demoData';
import { formatAnswerValue } from './utils/answerFormatter';
import { generateAssessmentJson, downloadAssessmentJson, calculateAssessmentAnalytics } from './utils/assessmentJsonGenerator';
import { buildPortalSubmission, downloadPortalSubmission } from './utils/portalSubmission';

import LandingPage from './components/LandingPage';
import DoctorLogin from './components/DoctorLogin';
import AddPatientModal from './components/AddPatientModal';
import PatientProfileView from './components/PatientProfileView';
import LanguageSelector from './components/LanguageSelector';
import WelcomeScreen from './components/WelcomeScreen';
import ContinuousAssessmentPage from './components/ContinuousAssessmentPage';
import DoctorDashboard from './components/DoctorDashboard';
import AboutModal from './components/AboutModal';

import {
  Heart,
  Globe,
  Stethoscope,
  MessageCircle,
  HelpCircle,
  Sparkles,
  Play,
  ArrowLeft,
  Home
} from 'lucide-react';

export default function App() {
  // Navigation: 'landing' | 'doctor_login' | 'doctor' | 'patient_profile' | 'language' | 'welcome' | 'chat' | 'review'
  const [currentView, setCurrentView] = useState('landing');
  const [lang, setLang] = useState('en');
  const [autoReadAloud, setAutoReadAloud] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  // Authenticated doctor state
  const [authenticatedDoctor, setAuthenticatedDoctor] = useState(null);

  // Doctor Dashboard initial tab & recent completion trigger
  const [doctorTab, setDoctorTab] = useState('visualisation');
  const [justCompletedAssessment, setJustCompletedAssessment] = useState(false);

  // Active patient for assessment (if created by doctor, demographic info is already attached)
  const [currentAssessmentPatient, setCurrentAssessmentPatient] = useState(null);

  // Assessment state (Doctor-entered answers and section-level notes)
  const [answers, setAnswers] = useState({});
  const [sectionNotes, setSectionNotes] = useState({});
  const [history, setHistory] = useState([]);
  const [questionQueue, setQuestionQueue] = useState([...QUESTIONS]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);

  // Clinician portal patient list
  const [patientsList, setPatientsList] = useState([...DEMO_PATIENTS]);
  const [activeDoctorPatientId, setActiveDoctorPatientId] = useState(DEMO_PATIENTS[0].id);

  // Visible submit error (never fail silently on SUBMIT ASSESSMENT)
  const [submitError, setSubmitError] = useState(null);

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const currentLangObj = LANGUAGES.find(l => l.id === lang) || LANGUAGES[0];

  const currentQuestion = questionQueue[currentQueueIndex];

  // Determine current section
  const currentSectionMeta = useMemo(() => {
    if (!currentQuestion) return SECTIONS_META[0];
    return SECTIONS_META.find(s => s.id === currentQuestion.section) || SECTIONS_META[0];
  }, [currentQuestion]);

  const currentSectionIndex = useMemo(() => {
    if (!currentQuestion) return 1;
    const idx = SECTIONS_META.findIndex(s => s.id === currentQuestion.section);
    return idx !== -1 ? idx + 1 : 1;
  }, [currentQuestion]);

  // Selected patient for profile view
  const activeProfilePatient = useMemo(() => {
    return patientsList.find(p => p.id === activeDoctorPatientId) || patientsList[0];
  }, [patientsList, activeDoctorPatientId]);

  // Section note change handler
  const handleSectionNoteChange = (sectionId, noteText) => {
    setSectionNotes(prev => ({
      ...prev,
      [sectionId]: noteText
    }));
  };

  // Handle answering a question (Doctor enters verbal response)
  const handleAnswer = (val, displayLabel = null) => {
    if (!currentQuestion) return;

    const qId = currentQuestion.id;
    const qText = currentQuestion.question[lang] || currentQuestion.question.en;

    // Neutral confirmation for doctor records
    let ack = null;
    if (qId === 'consanguineous_marriage' && val === 'yes') {
      ack = "Recorded consanguineous marriage history.";
    } else if (qId === 'previous_pregnancy' && val === 'no') {
      ack = "No previous pregnancy recorded.";
    } else if (val === 'yes') {
      if (qId.startsWith('medical_') || qId === 'family_genetic' || qId === 'taking_medications') {
        ack = "Clinical history affirmative recorded.";
      }
    } else if (val === 'not_sure') {
      ack = "Recorded as 'NOT SURE' for review.";
    }

    const newAnswers = { ...answers, [qId]: val };
    setAnswers(newAnswers);

    const historyEntry = {
      questionId: qId,
      questionText: qText,
      answerValue: val,
      answerDisplay: displayLabel || formatAnswerValue(val),
      acknowledgement: ack,
      source: currentQuestion.source
    };

    setHistory(prev => [...prev, historyEntry]);

    // Smart Branching Logic:
    let newQueue = [...questionQueue];
    if (currentQuestion.followUps && currentQuestion.followUps.length > 0) {
      if (currentQuestion.followUpIf && val === currentQuestion.followUpIf) {
        // Splice follow-ups immediately after current question
        newQueue.splice(currentQueueIndex + 1, 0, ...currentQuestion.followUps);
        setQuestionQueue(newQueue);
      }
    }

    // Advance to next question or complete to review
    if (currentQueueIndex + 1 < newQueue.length) {
      setCurrentQueueIndex(currentQueueIndex + 1);
    } else {
      setCurrentView('review');
    }
  };

  // Back action in assessment
  const handleBack = () => {
    if (history.length === 0) return;
    const prevHistory = [...history];
    const lastItem = prevHistory.pop();
    setHistory(prevHistory);

    const updatedAnswers = { ...answers };
    delete updatedAnswers[lastItem.questionId];
    setAnswers(updatedAnswers);

    if (currentQueueIndex > 0) {
      setCurrentQueueIndex(currentQueueIndex - 1);
    }
  };

  // Skip question
  const handleSkip = () => {
    if (!currentQuestion) return;
    handleAnswer('skipped', 'Skipped');
  };


  // Handle continuous answer selection
  const handleContinuousAnswer = (qId, val, qText = '', secId = '') => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
    setHistory(prev => {
      const filtered = prev.filter(h => h.questionId !== qId);
      return [
        ...filtered,
        {
          questionId: qId,
          questionText: qText,
          answerValue: val,
          answerDisplay: formatAnswerValue(val),
          section: secId
        }
      ];
    });
  };

  // Save Draft action
  const handleSaveDraft = () => {
    const now = new Date();
    const assessmentDateFormatted = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const isExisting = Boolean(currentAssessmentPatient);
    const patientId = isExisting ? currentAssessmentPatient.id : `PT-${Math.floor(1000 + Math.random() * 9000)}`;

    const patientInfo = isExisting ? currentAssessmentPatient : {
      id: patientId,
      name: "Patient (Walk-In Consultation)",
      age: 28,
      phone: "+91 98000 00000",
      address: "Local Clinic Visit",
      city: "City",
      marriageDate: "",
      yearsMarried: 1,
      previousMarriage: "no",
      doctorDescription: "Preconception assessment draft in progress.",
      language: currentLangObj.name,
      status: "Draft",
      isDemo: false,
      assessments: [],
      notes: []
    };

    const draftAssessment = {
      id: `ASM-${patientId}-draft`,
      patientId: patientId,
      date: assessmentDateFormatted,
      isoDate: now.toISOString(),
      language: currentLangObj.name,
      answers: { ...answers },
      sectionNotes: { ...sectionNotes },
      history: [...history],
      status: 'Draft'
    };

    const updatedPatient = {
      ...patientInfo,
      status: 'Draft',
      completedAt: assessmentDateFormatted,
      language: currentLangObj.name,
      answers: { ...answers },
      sectionNotes: { ...sectionNotes },
      assessments: [draftAssessment, ...(patientInfo.assessments?.filter(a => a.id !== draftAssessment.id) || [])]
    };

    if (isExisting) {
      setPatientsList(prev => prev.map(p => p.id === patientId ? updatedPatient : p));
    } else {
      setPatientsList([updatedPatient, ...patientsList]);
    }

    setActiveDoctorPatientId(patientId);
    return true;
  };

  // Complete Assessment action (Bottom button and top button)
  // Portal Submit -> portal_submission.json (ONLY clinical source of truth).
  // Backend: python generator.py submit <file> -> source.json -> prepare -> build.
  const handleCompleteAssessment = (customPatientDetails = null, extraNotes = {}) => {
    console.log('[SUBMIT] started');
    setSubmitError(null);
    try {
    const now = new Date();
    const assessmentDateFormatted = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const isExisting = Boolean(currentAssessmentPatient);
    const patientId = isExisting ? currentAssessmentPatient.id : `PT-${Math.floor(1000 + Math.random() * 9000)}`;

    const patientInfo = {
      id: patientId,
      name: customPatientDetails?.name || currentAssessmentPatient?.name || "Patient (Walk-In Consultation)",
      age: customPatientDetails?.age ? Number(customPatientDetails.age) : (currentAssessmentPatient?.age || 28),
      phone: customPatientDetails?.phone || currentAssessmentPatient?.phone || "+91 98000 00000",
      address: customPatientDetails?.address || currentAssessmentPatient?.address || "Local Clinic Visit",
      city: customPatientDetails?.city || currentAssessmentPatient?.city || "City",
      marriageDate: currentAssessmentPatient?.marriageDate || "",
      yearsMarried: currentAssessmentPatient?.yearsMarried ?? 1,
      previousMarriage: currentAssessmentPatient?.previousMarriage || "no",
      doctorDescription: customPatientDetails?.doctorDescription || currentAssessmentPatient?.doctorDescription || "Preconception clinical assessment completed.",
      language: currentLangObj.name,
      status: "Completed",
      isDemo: currentAssessmentPatient?.isDemo || false,
      assessments: currentAssessmentPatient?.assessments || [],
      notes: currentAssessmentPatient?.notes || []
    };

    // Calculate actual analytics strictly from the entered answers
    const analytics = calculateAssessmentAnalytics(answers, history);

    // Generate JSON representation adhering strictly to clinician schema
    const assessmentJson = generateAssessmentJson({
      patient: patientInfo,
      history: history,
      answers: answers,
      sectionNotes: sectionNotes,
      assessmentDate: now.toISOString(),
      assessmentStatus: "completed"
    });

    // Automatically download the JSON file (legacy dashboard payload)
    downloadAssessmentJson(assessmentJson, patientInfo.name);

    // Portal submission JSON — the ONLY clinical source of truth for
    // the PRECONCEPTION report pipeline (generator.py submit -> source.json).
    // Every selected checkbox + every note preserved; unselected omitted.
    console.log('[SUBMIT] building portal submission');
    const portalSubmission = buildPortalSubmission({
      patient: { name: patientInfo.name, record_id: patientId },
      encounterDate: now.toISOString().slice(0, 10),
      doctorDescription:
        customPatientDetails?.doctorDescription || patientInfo.doctorDescription || '',
      answers,
      history,
      sectionNotes,
      extra: {
        examination: extraNotes?.examination || '',
        assessment: extraNotes?.assessment || '',
        plan: extraNotes?.plan || '',
      },
    });
    console.log('[SUBMIT] submission created', {
      answers: Object.keys(portalSubmission.answers || {}).length,
      history: (portalSubmission.history || []).length,
      sectionNotes: Object.keys(portalSubmission.section_notes || {}).length,
      questionMeta: Object.keys(portalSubmission.question_meta || {}).length,
    });
    const portalOk = downloadPortalSubmission(portalSubmission, patientInfo.name);
    if (!portalOk) {
      throw new Error('portal_submission.json download failed in this browser.');
    }
    console.log('[SUBMIT] download triggered');

    const newAssessmentId = `ASM-${patientId}-${(patientInfo.assessments?.length || 0) + 1}`;
    const newAssessment = {
      id: newAssessmentId,
      patientId: patientId,
      date: assessmentDateFormatted,
      isoDate: now.toISOString(),
      language: currentLangObj.name,
      answers: { ...answers },
      sectionNotes: { ...sectionNotes },
      history: [...history],
      analytics: assessmentJson.analytics,
      jsonPayload: assessmentJson,
      status: 'Completed'
    };

    const updatedPatient = {
      ...patientInfo,
      status: 'Completed',
      completedAt: assessmentDateFormatted,
      language: currentLangObj.name,
      answers: { ...answers },
      sectionNotes: { ...sectionNotes },
      latestAssessmentJson: assessmentJson,
      // Retain all previous assessments so they are never overwritten
      assessments: [newAssessment, ...(patientInfo.assessments || [])]
    };

    if (isExisting) {
      setPatientsList(prev => prev.map(p => p.id === patientId ? updatedPatient : p));
    } else {
      setPatientsList([updatedPatient, ...patientsList]);
    }

    setActiveDoctorPatientId(patientId);
    setCurrentAssessmentPatient(null);
    setDoctorTab('visualisation');
    setJustCompletedAssessment(true);
    setCurrentView('doctor');

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    console.log('[SUBMIT] completed');
    } catch (err) {
      console.error('[SUBMIT] failed:', err);
      setSubmitError(
        `Submission failed: ${err?.message || err}. No files were downloaded. Please retry or contact support.`
      );
    }
  };

  // Start continuous assessment for a specific patient
  const handleStartPatientAssessment = (patient = null) => {
    setCurrentAssessmentPatient(patient);
    setAnswers(patient?.answers || {});
    setSectionNotes(patient?.sectionNotes || {});
    setHistory([]);
    setCurrentView('assessment');
  };

  // Trigger Realistic Demo Flow
  const handleStartDemo = () => {
    const demo = DEMO_PATIENTS[0]; // Ananya Sharma
    setCurrentAssessmentPatient(demo);
    setAnswers({ ...demo.answers });
    const demoSectionNotes = {
      medical: "TSH 2.1 mIU/L on 50mcg Thyronorm. Dose stable for 1 year.",
      environment: "Occasional exposure to gardening pesticides at home."
    };
    setSectionNotes(demoSectionNotes);

    const syntheticHistory = [];
    QUESTIONS.forEach(q => {
      if (demo.answers[q.id]) {
        syntheticHistory.push({
          questionId: q.id,
          questionText: q.question[lang] || q.question.en,
          answerValue: demo.answers[q.id],
          answerDisplay: formatAnswerValue(demo.answers[q.id]),
          source: q.source
        });
      }
      if (q.followUps) {
        q.followUps.forEach(sub => {
          if (demo.answers[sub.id]) {
            syntheticHistory.push({
              questionId: sub.id,
              questionText: sub.question[lang] || sub.question.en,
              answerValue: demo.answers[sub.id],
              answerDisplay: formatAnswerValue(demo.answers[sub.id]),
              source: sub.source
            });
          }
        });
      }
    });

    setHistory(syntheticHistory);
    setCurrentView('assessment');
  };

  // Doctor login handler
  const handleDoctorLoginSuccess = (doctorInfo) => {
    setAuthenticatedDoctor(doctorInfo);
    setCurrentView('doctor');
  };

  // Patient update callback from doctor dashboard
  const handleUpdatePatient = (updatedPatient) => {
    setPatientsList(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  // Save new patient from AddPatientModal
  const handleSavePatient = (newPatient) => {
    setPatientsList([newPatient, ...patientsList]);
    setActiveDoctorPatientId(newPatientId => newPatient.id);
  };

  const handleSaveAndStartAssessment = (newPatient) => {
    setPatientsList([newPatient, ...patientsList]);
    setActiveDoctorPatientId(newPatient.id);
    handleStartPatientAssessment(newPatient);
  };

  return (
    <div className="app-container">
      {/* Universal Navigation Header - for inner application views */}
      {currentView !== 'landing' && (
        <nav className="top-navbar">
          <div
            className="brand-section"
            onClick={() => setCurrentView('landing')}
            style={{ cursor: 'pointer' }}
            title="Go to Home"
          >
            <div className="brand-badge-icon">
              <Heart size={20} />
            </div>
            <div className="brand-titles">
              <span className="brand-name">Preconception Care Assistant</span>
              <span className="brand-tagline">FOGSI Safe Motherhood Guidelines</span>
            </div>
          </div>

          <div className="nav-actions">
            {/* Home button */}
            <button
              className={`nav-pill-btn ${currentView === 'landing' ? 'active' : ''}`}
              onClick={() => setCurrentView('landing')}
              title="Landing page"
              type="button"
            >
              <Home size={15} />
              <span>Home</span>
            </button>

            {/* Language selector */}
            <button
              className="nav-pill-btn"
              onClick={() => setCurrentView('language')}
              title="Change language"
              type="button"
            >
              <Globe size={15} />
              <span>{currentLangObj.native}</span>
            </button>

            {/* Quick Demo button */}
            <button
              className="nav-pill-btn"
              onClick={handleStartDemo}
              title="Load sample patient"
              type="button"
            >
              <Play size={14} color="#e11d48" />
              <span style={{ color: '#e11d48' }}>Try Demo</span>
            </button>

            {/* Doctor Portal toggle */}
            <button
              className={`nav-pill-btn ${currentView === 'doctor' || currentView === 'doctor_login' ? 'active' : ''}`}
              onClick={() => {
                if (currentView === 'doctor' || currentView === 'doctor_login') {
                  setCurrentView(history.length > 0 ? 'review' : 'landing');
                } else {
                  if (authenticatedDoctor) {
                    setCurrentView('doctor');
                  } else {
                    setCurrentView('doctor_login');
                  }
                }
              }}
              type="button"
            >
              <Stethoscope size={15} />
              <span>{currentView === 'doctor' ? 'Clinical Assessment' : 'Doctor Dashboard'}</span>
            </button>

            {/* About FOGSI Guidelines button */}
            <button
              className="nav-pill-btn"
              onClick={() => setIsAboutOpen(true)}
              title="About assessment & safety"
              type="button"
            >
              <HelpCircle size={15} />
            </button>
          </div>
        </nav>
      )}

      {/* Main View Router */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 1. LANDING PAGE */}
        {currentView === 'landing' && (
          <LandingPage
            currentLang={lang}
            onSelectLanguage={setLang}
            onStartPatientAssessment={() => handleStartPatientAssessment(null)}
            onDoctorLogin={() => {
              if (authenticatedDoctor) {
                setCurrentView('doctor');
              } else {
                setCurrentView('doctor_login');
              }
            }}
            onTryDemo={handleStartDemo}
            onOpenAbout={() => setIsAboutOpen(true)}
          />
        )}

        {/* 2. DOCTOR LOGIN */}
        {currentView === 'doctor_login' && (
          <DoctorLogin
            onLoginSuccess={handleDoctorLoginSuccess}
            onBackToHome={() => setCurrentView('landing')}
          />
        )}

        {/* 3. DOCTOR DASHBOARD */}
        {currentView === 'doctor' && (
          <DoctorDashboard
            patientsList={patientsList}
            currentActivePatientId={activeDoctorPatientId}
            initialTab={doctorTab}
            justCompleted={justCompletedAssessment}
            onClearJustCompleted={() => setJustCompletedAssessment(false)}
            onSelectPatient={(pId) => {
              setActiveDoctorPatientId(pId);
              setJustCompletedAssessment(false);
            }}
            onStartAssessment={(pt) => handleStartPatientAssessment(pt)}
            onBackToChat={() => setCurrentView('assessment')}
            onOpenAddPatient={() => setIsAddPatientOpen(true)}
            onUpdatePatient={handleUpdatePatient}
            activeDoctor={authenticatedDoctor}
          />
        )}

        {/* 4. PATIENT PROFILE VIEW */}
        {currentView === 'patient_profile' && (
          <PatientProfileView
            patient={activeProfilePatient}
            onStartAssessment={(pt) => handleStartPatientAssessment(pt)}
            onViewAssessment={(pt) => {
              setActiveDoctorPatientId(pt.id);
              setCurrentView('doctor');
            }}
            onOpenAssessmentHistory={(pt) => {
              setActiveDoctorPatientId(pt.id);
              setCurrentView('doctor');
            }}
            onAddDoctorNote={(pt) => {
              setActiveDoctorPatientId(pt.id);
              setCurrentView('doctor');
            }}
            onEditPatient={() => setIsAddPatientOpen(true)}
            onBackToPatientsList={() => setCurrentView('doctor')}
          />
        )}

        {/* 5. PATIENT LANGUAGE SELECTION */}
        {currentView === 'language' && (
          <LanguageSelector
            selectedLang={lang}
            onSelectLang={setLang}
            onContinue={() => setCurrentView('welcome')}
          />
        )}

        {/* 6. PATIENT WELCOME SCREEN */}
        {currentView === 'welcome' && (
          <WelcomeScreen
            lang={lang}
            autoReadAloud={autoReadAloud}
            onToggleAutoRead={setAutoReadAloud}
            onStartAssessment={() => setCurrentView('chat')}
            onStartDemo={handleStartDemo}
            onChangeLanguage={() => setCurrentView('language')}
          />
        )}

        {/* 7. ONE CONTINUOUS CLINICAL ASSESSMENT PAGE (Replaces slide-by-slide) */}
        {(currentView === 'assessment' || currentView === 'chat' || currentView === 'review') && (
          <ContinuousAssessmentPage
            patient={currentAssessmentPatient}
            answers={answers}
            sectionNotes={sectionNotes}
            lang={lang}
            onAnswer={handleContinuousAnswer}
            onSectionNoteChange={handleSectionNoteChange}
            onSaveDraft={handleSaveDraft}
            onCompleteAssessment={handleCompleteAssessment}
            onBackToDashboard={() => setCurrentView('doctor')}
            submitError={submitError}
            onDismissSubmitError={() => setSubmitError(null)}
          />
        )}
      </main>

      {/* + Add Patient Modal */}
      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        onSavePatient={handleSavePatient}
        onSaveAndStartAssessment={handleSaveAndStartAssessment}
      />

      {/* About Guidelines Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
