import React, { useState, useEffect, useRef } from 'react';
import { UI_TRANSLATIONS, LANGUAGES } from '../data/translations';
import { SECTIONS_META } from '../data/fogsiQuestions';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Check,
  X,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  User,
  Heart
} from 'lucide-react';
import {
  speakText,
  stopSpeaking,
  createSpeechRecognizer,
  isSpeechRecognitionSupported
} from '../utils/speechUtils';

export default function ChatInterface({
  lang,
  currentQuestion,
  answers,
  history,
  onAnswer,
  onBack,
  onSkip,
  autoReadAloud,
  sectionIndex,
  totalSections,
  currentSectionTitle
}) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const currentLangObj = LANGUAGES.find(l => l.id === lang) || LANGUAGES[0];

  const [textInput, setTextInput] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');

  const recognizerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat when new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, currentQuestion]);

  // Read current question aloud when autoRead is active or question changes
  useEffect(() => {
    if (!currentQuestion) return;

    const qText = currentQuestion.question[lang] || currentQuestion.question.en;
    if (autoReadAloud) {
      speakText(
        qText,
        currentLangObj.speechCode,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }

    // Reset input fields
    setTextInput('');
    setSelectedOptions([]);
    setSpeechTranscript('');

    return () => {
      stopSpeaking();
      if (recognizerRef.current) {
        try { recognizerRef.current.abort(); } catch (e) {}
      }
    };
  }, [currentQuestion?.id, lang, autoReadAloud]);

  const handleManualSpeak = (textToSpeak) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakText(
        textToSpeak,
        currentLangObj.speechCode,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  // Voice Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert("Voice input is not supported in this browser. Please type your answer.");
      return;
    }

    try {
      const recognizer = createSpeechRecognizer(
        currentLangObj.speechCode,
        (transcript, isFinal) => {
          setSpeechTranscript(transcript);
          setTextInput(transcript);

          // If current question is yes/no and speech recognized affirmative/negative, we can auto-help
          if (currentQuestion.type === 'yes_no_unknown' || currentQuestion.type === 'yes_no') {
            const lower = transcript.toLowerCase().trim();
            if (lower.includes('yes') || lower.includes('हाँ') || lower.includes('అవును') || lower.includes('ஆம்') || lower.includes('ಹೌದು') || lower.includes('അതെ') || lower.includes('হ্যাঁ') || lower.includes('होय')) {
              onAnswer('yes', transcript);
              setIsListening(false);
              recognizer.stop();
            } else if (lower.includes('no') || lower.includes('नहीं') || lower.includes('కాదు') || lower.includes('இல்லை') || lower.includes('ಇಲ್ಲ') || lower.includes('അല്ല') || lower.includes('না') || lower.includes('नाही')) {
              onAnswer('no', transcript);
              setIsListening(false);
              recognizer.stop();
            }
          }
        },
        (err) => {
          console.warn("Speech error:", err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );

      if (recognizer) {
        recognizerRef.current = recognizer;
        recognizer.start();
        setIsListening(true);
      }
    } catch (e) {
      console.warn("Speech recognition initialization error:", e);
      setIsListening(false);
    }
  };

  const handleTextSubmit = (e) => {
    e?.preventDefault();
    if (!textInput.trim()) return;
    onAnswer(textInput.trim(), textInput.trim());
    setTextInput('');
    setSpeechTranscript('');
  };

  const handleMultiSelectToggle = (val) => {
    if (selectedOptions.includes(val)) {
      setSelectedOptions(selectedOptions.filter(item => item !== val));
    } else {
      setSelectedOptions([...selectedOptions, val]);
    }
  };

  const handleMultiSelectSubmit = () => {
    if (selectedOptions.length === 0) return;
    onAnswer(selectedOptions, selectedOptions.join(', '));
  };

  if (!currentQuestion) return null;

  const currentQText = currentQuestion.question[lang] || currentQuestion.question.en;

  // Calculate overall progress
  const progressPercent = Math.min(100, Math.round(((sectionIndex) / totalSections) * 100));

  return (
    <div className="chat-page-container">
      {/* Top Progress Bar */}
      <div className="progress-panel">
        <div className="progress-labels">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: 'var(--primary-600)' }}>🌸</span>
            <span>{t.progressLabel}</span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>
              {currentSectionTitle}
            </span>
          </div>
          <span style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
            {progressPercent}%
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${Math.max(8, progressPercent)}%` }} />
        </div>
      </div>

      {/* Messages History List */}
      <div className="messages-history">
        {history.map((item, idx) => (
          <React.Fragment key={idx}>
            {/* Assistant Bubble */}
            <div className="chat-bubble-row assistant">
              <div className="avatar-icon assistant">
                <Heart size={20} fill="#e11d48" color="#e11d48" />
              </div>
              <div className="bubble-content">
                <p className="bubble-question-text">{item.questionText}</p>
                {item.source && (
                  <div className="bubble-source-tag">
                    <ShieldCheck size={12} color="#059669" />
                    <span>{item.source}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Patient Answer Bubble */}
            <div className="chat-bubble-row user">
              <div className="bubble-content">
                <div className="bubble-user-answer">
                  {item.answerDisplay}
                </div>
              </div>
              <div className="avatar-icon user">
                <User size={20} />
              </div>
            </div>

            {/* Optional Small Confirmation message if present */}
            {item.acknowledgement && (
              <div className="chat-bubble-row assistant" style={{ opacity: 0.9 }}>
                <div className="avatar-icon assistant" style={{ width: '32px', height: '32px' }}>
                  <Sparkles size={16} />
                </div>
                <div className="bubble-content" style={{ padding: '0.6rem 0.9rem', fontSize: '0.9rem', background: '#fff8f9' }}>
                  <span>{item.acknowledgement}</span>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Current Active Question Bubble */}
        <div className="chat-bubble-row assistant">
          <div className="avatar-icon assistant">
            <Heart size={20} fill="#e11d48" color="#e11d48" />
          </div>
          <div className="bubble-content" style={{ borderColor: 'var(--primary-200)', background: '#ffffff' }}>
            <p className="bubble-question-text">{currentQText}</p>

            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.65rem' }}>
              {/* Speaker Audio Button */}
              <button
                className={`bubble-audio-btn ${isSpeaking ? 'speaking' : ''}`}
                onClick={() => handleManualSpeak(currentQText)}
                type="button"
                title="Read question aloud"
              >
                {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{isSpeaking ? t.stopSpeech : t.readAloud}</span>
              </button>

              {/* Source metadata reference badge */}
              {currentQuestion.source && (
                <div className="bubble-source-tag">
                  <ShieldCheck size={12} color="#059669" />
                  <span>{currentQuestion.source}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Voice listening status indicator */}
      {isListening && (
        <div className="voice-listening-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="voice-wave-animation">
              <span />
              <span />
              <span />
            </div>
            <span>{t.speakNow} ({currentLangObj.name})</span>
          </div>
          <button
            onClick={toggleListening}
            style={{ fontWeight: 700, textDecoration: 'underline', color: '#991b1b' }}
            type="button"
          >
            {t.stopVoice}
          </button>
        </div>
      )}

      {/* Answer Dock */}
      <div className="answer-dock-container">
        {/* TYPE 1: YES / NO / NOT SURE */}
        {currentQuestion.type === 'yes_no_unknown' && (
          <div className="yes-no-action-grid">
            <button
              className="btn-yes-huge"
              onClick={() => onAnswer('yes', t.yes)}
              type="button"
            >
              <Check size={22} strokeWidth={3} />
              <span>{t.yes}</span>
            </button>

            <button
              className="btn-no-huge"
              onClick={() => onAnswer('no', t.no)}
              type="button"
            >
              <X size={22} strokeWidth={3} />
              <span>{t.no}</span>
            </button>

            <button
              className="btn-not-sure-huge btn-not-sure-full"
              onClick={() => onAnswer('not_sure', t.notSure)}
              type="button"
            >
              <HelpCircle size={18} />
              <span>{t.notSure}</span>
            </button>
          </div>
        )}

        {/* TYPE 2: STRICT YES / NO */}
        {currentQuestion.type === 'yes_no' && (
          <div className="yes-no-action-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <button
              className="btn-yes-huge"
              onClick={() => onAnswer('yes', t.yes)}
              type="button"
            >
              <Check size={22} strokeWidth={3} />
              <span>{t.yes}</span>
            </button>

            <button
              className="btn-no-huge"
              onClick={() => onAnswer('no', t.no)}
              type="button"
            >
              <X size={22} strokeWidth={3} />
              <span>{t.no}</span>
            </button>
          </div>
        )}

        {/* TYPE 3: SINGLE CHOICE OPTIONS */}
        {currentQuestion.type === 'choice' && (
          <div className="options-stack">
            {currentQuestion.options.map((opt) => {
              const label = opt.label[lang] || opt.label.en;
              return (
                <button
                  key={opt.value}
                  className="option-select-card"
                  onClick={() => onAnswer(opt.value, label)}
                  type="button"
                >
                  <span>{label}</span>
                  <ChevronRight size={18} color="var(--primary-600)" />
                </button>
              );
            })}
          </div>
        )}

        {/* TYPE 4: MULTI-SELECT OPTIONS */}
        {currentQuestion.type === 'multi_select' && (
          <div>
            <div className="options-stack">
              {currentQuestion.options.map((opt) => {
                const label = opt.label[lang] || opt.label.en;
                const isSelected = selectedOptions.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    className={`option-select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleMultiSelectToggle(opt.value)}
                    type="button"
                  >
                    <span>{label}</span>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      border: isSelected ? '2px solid var(--primary-600)' : '2px solid #cbd5e1',
                      background: isSelected ? 'var(--primary-600)' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              className="btn-primary-lg"
              style={{ width: '100%', padding: '0.85rem' }}
              onClick={handleMultiSelectSubmit}
              disabled={selectedOptions.length === 0}
              type="button"
            >
              <span>{t.submitAnswer} ({selectedOptions.length})</span>
            </button>
          </div>
        )}

        {/* TYPE 5: TEXT INPUT OR VOICE FREE-FORM */}
        {currentQuestion.type === 'text_input' && (
          <form onSubmit={handleTextSubmit}>
            <div className="input-interactive-bar">
              <input
                type="text"
                className="chat-text-input"
                placeholder={t.typePlaceholder}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />

              <button
                type="button"
                className={`btn-mic-icon ${isListening ? 'listening' : ''}`}
                onClick={toggleListening}
                title={isListening ? t.stopVoice : t.startVoice}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                type="submit"
                className="btn-send-answer"
                disabled={!textInput.trim()}
              >
                <span>{t.next}</span>
                <Send size={16} />
              </button>
            </div>
          </form>
        )}

        {/* Bottom bar with Back / Skip controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.75rem',
          paddingTop: '0.65rem',
          borderTop: '1px dashed var(--border-subtle)'
        }}>
          {history.length > 0 ? (
            <button
              onClick={onBack}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}
              type="button"
            >
              <ArrowLeft size={15} />
              <span>{t.back}</span>
            </button>
          ) : <div />}

          <button
            onClick={onSkip}
            style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
            type="button"
          >
            {t.skipQuestion}
          </button>
        </div>
      </div>
    </div>
  );
}
