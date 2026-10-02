import React from 'react';
import { HeartHandshake, Baby } from 'lucide-react';
import './mother.css';

// Home-screen mode switch.
// "Planning a pregnancy" -> existing MaatriSakhi flow (UNCHANGED).
// "I'm pregnant"         -> new flow built in src/components/mother/.
export default function ModeSwitch({ mother, onSelect }) {
  return (
    <div className="mother-wrap animate-fade-in">
      <div className="mother-card">
        <p className="mother-hello">Hello, {mother?.name || 'there'} 🌸 — choose your journey</p>
        <div className="mode-grid">
          <button type="button" className="mode-card" onClick={() => onSelect('planning')}>
            <HeartHandshake size={28} color="#e11d48" />
            <strong>Planning a pregnancy</strong>
            <span>Your current MaatriSakhi preconception flow — unchanged.</span>
            <em>Go to existing assessment →</em>
          </button>
          <button type="button" className="mode-card highlight" onClick={() => onSelect('pregnant')}>
            <Baby size={28} color="#059669" />
            <strong>I'm pregnant</strong>
            <span>New: profile setup + BP / sugar trackers + visit prep.</span>
            <em>Start pregnancy flow →</em>
          </button>
        </div>
      </div>
    </div>
  );
}
