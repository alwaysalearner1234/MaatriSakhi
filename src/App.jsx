import React, { useState, useMemo } from 'react';
import { QUESTIONS, SECTIONS_META } from './data/fogsiQuestions';
import { UI_TRANSLATIONS, LANGUAGES } from './data/translations';
import { DEMO_PATIENTS } from './data/demoData';

import LanguageSelector from './components/LanguageSelector';
import WelcomeScreen from './components/WelcomeScreen';
import ChatInterface from './components/ChatInterface';
import PatientReview from './components/PatientReview';
import DoctorDashboard from './components/DoctorDashboard';
import AboutModal from './components/AboutModal';

import {
  Heart,
  Globe,
  Stethoscope,
  MessageCircle,
  HelpCircle,
  Sparkles,
  Play
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('language'); // 'language' | 'welcome' | 'chat' | 'review' | 'doctor'
  const [lang, setLang] = useState('en');
  const [autoReadAloud, setAutoReadAloud] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Patient assessment state
  const [answers, setAnswers] = useState({});
  const [history, setHistory] = useState([]);
  const [questionQueue, setQuestionQueue] = useState([...QUESTIONS]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);

  // Clinician portal patient list (includes pre-loaded realistic cases + newly submitted patient)
  const [patientsList, setPatientsList] = useState([...DEMO_PATIENTS]);
  const [activeDoctorPatientId, setActiveDoctorPatientId] = useState(DEMO_PATIENTS[0].id);

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

  // Handle answering a question
  const handleAnswer = (val, displayLabel) => {
    if (!currentQuestion) return;

    const qId = currentQuestion.id;
    const qText = currentQuestion.question[lang] || currentQuestion.question.en;

    // Build neutral acknowledgment
    let ack = null;
    if (val === 'yes') {
      if (qId.startsWith('medical_') || qId === 'family_genetic' || qId === 'taking_medications') {
        ack = t.neutralAcknowledgement;
      }
    } else if (val === 'not_sure') {
      ack = "Recorded as 'Not sure' for your doctor.";
    }

    const newAnswers = { ...answers, [qId]: val };
    setAnswers(newAnswers);

    const historyEntry = {
      questionId: qId,
      questionText: qText,
      answerValue: val,
      answerDisplay: displayLabel || String(val),
      acknowledgement: ack,
      source: currentQuestion.source
    };

    setHistory(prev => [...prev, historyEntry]);

    // Smart Branching Logic:
    // Check if current question triggers follow-ups
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

  // Back action
  const handleBack = () => {
    if (history.length === 0) return;
    const prevHistory = [...history];
    const lastItem = prevHistory.pop();
    setHistory(prevHistory);

    // Remove last answer
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

  // Edit question from review screen
  const handleEditQuestion = (targetQId) => {
    const targetIdx = questionQueue.findIndex(q => q.id === targetQId);
    if (targetIdx !== -1) {
      // Trim history up to target
      const targetHistoryIdx = history.findIndex(h => h.questionId === targetQId);
      if (targetHistoryIdx !== -1) {
        setHistory(history.slice(0, targetHistoryIdx));
      }
      setCurrentQueueIndex(targetIdx);
      setCurrentView('chat');
    }
  };

  // Submit to doctor from review screen
  const handleSubmitToDoctor = () => {
    const newPatientId = `PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient = {
      id: newPatientId,
      name: "Patient (Current Session)",
      age: 29,
      language: currentLangObj.name,
      completedAt: "Just now",
      status: "Submitted",
      isDemo: false,
      answers: { ...answers }
    };

    setPatientsList([newPatient, ...patientsList]);
    setActiveDoctorPatientId(newPatientId);
    setCurrentView('doctor');
  };

  // Trigger Realistic Demo Patient
  const handleStartDemo = () => {
    const demo = DEMO_PATIENTS[0]; // Ananya Sharma
    setAnswers(demo.answers);

    // Build synthetic history for review
    const syntheticHistory = [];
    QUESTIONS.forEach(q => {
      if (demo.answers[q.id]) {
        syntheticHistory.push({
          questionId: q.id,
          questionText: q.question[lang] || q.question.en,
          answerValue: demo.answers[q.id],
          answerDisplay: String(demo.answers[q.id]).toUpperCase(),
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
              answerDisplay: Array.isArray(demo.answers[sub.id]) ? demo.answers[sub.id].join(', ') : String(demo.answers[sub.id]),
              source: sub.source
            });
          }
        });
      }
    });

    setHistory(syntheticHistory);
    setCurrentView('review');
  };

  const handleStartFreshAssessment = () => {
    setAnswers({});
    setHistory([]);
    setQuestionQueue([...QUESTIONS]);
    setCurrentQueueIndex(0);
    setCurrentView('chat');
  };

  return (
    <div className="app-container">
      {/* Universal Navigation Header */}
      <nav className="top-navbar">
        <div className="brand-section">
          <div className="brand-badge-icon">
            <Heart size={20} />
          </div>
          <div className="brand-titles">
            <span className="brand-name">Preconception Care Assistant</span>
            <span className="brand-tagline">FOGSI Safe Motherhood Guidelines</span>
          </div>
        </div>

        <div className="nav-actions">
          {/* Language badge / switcher */}
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
            className={`nav-pill-btn ${currentView === 'doctor' ? 'active' : ''}`}
            onClick={() => {
              if (currentView === 'doctor') {
                setCurrentView(history.length > 0 ? 'review' : 'welcome');
              } else {
                setCurrentView('doctor');
              }
            }}
            type="button"
          >
            <Stethoscope size={15} />
            <span>{currentView === 'doctor' ? t.patientView : t.doctorPortal}</span>
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

      {/* Main View Render */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentView === 'language' && (
          <LanguageSelector
            selectedLang={lang}
            onSelectLang={setLang}
            onContinue={() => setCurrentView('welcome')}
          />
        )}

        {currentView === 'welcome' && (
          <WelcomeScreen
            lang={lang}
            autoReadAloud={autoReadAloud}
            onToggleAutoRead={setAutoReadAloud}
            onStartAssessment={handleStartFreshAssessment}
            onStartDemo={handleStartDemo}
            onChangeLanguage={() => setCurrentView('language')}
          />
        )}

        {currentView === 'chat' && (
          <ChatInterface
            lang={lang}
            currentQuestion={currentQuestion}
            answers={answers}
            history={history}
            onAnswer={handleAnswer}
            onBack={handleBack}
            onSkip={handleSkip}
            autoReadAloud={autoReadAloud}
            sectionIndex={currentSectionIndex}
            totalSections={SECTIONS_META.length}
            currentSectionTitle={t.sections[currentSectionMeta.id] || currentSectionMeta.id}
          />
        )}

        {currentView === 'review' && (
          <PatientReview
            lang={lang}
            answers={answers}
            history={history}
            onEditQuestion={handleEditQuestion}
            onSubmitToDoctor={handleSubmitToDoctor}
          />
        )}

        {currentView === 'doctor' && (
          <DoctorDashboard
            patientsList={patientsList}
            currentActivePatientId={activeDoctorPatientId}
            onSelectPatient={setActiveDoctorPatientId}
            onBackToChat={() => setCurrentView(history.length > 0 ? 'review' : 'welcome')}
          />
        )}
      </main>

      {/* About Guidelines Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
