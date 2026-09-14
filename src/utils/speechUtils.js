// Speech Recognition and Text-to-Speech utilities for browser environments

export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export const isSpeechRecognitionSupported = () => {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

export const createSpeechRecognizer = (langCode = 'en-IN', onResult, onError, onEnd) => {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognizer = new SpeechRecognition();
  recognizer.continuous = false;
  recognizer.interimResults = true;
  recognizer.lang = langCode;

  recognizer.onresult = (event) => {
    let interim = '';
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }
    if (onResult) {
      onResult(finalTranscript || interim, !!finalTranscript);
    }
  };

  recognizer.onerror = (err) => {
    console.warn('Speech recognition error:', err);
    if (onError) onError(err);
  };

  recognizer.onend = () => {
    if (onEnd) onEnd();
  };

  return recognizer;
};

export const speakText = (text, langCode = 'en-IN', onStart, onEnd) => {
  if (!isSpeechSynthesisSupported()) return;

  window.speechSynthesis.cancel(); // Stop any pending utterance

  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  utterance.rate = 0.95; // Slightly slower for clear medical understanding
  utterance.pitch = 1.05;

  // Try to pick a natural sounding voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang === langCode || v.lang.startsWith(langCode.slice(0, 2)));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};
