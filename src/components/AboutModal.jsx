import React from 'react';
import { X, ShieldCheck, BookOpen, Heart, Award } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <div className="brand-badge-icon" style={{ width: '36px', height: '36px' }}>
            <Heart size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>About Preconception Care Assistant</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Safe Motherhood Committee, FOGSI
            </span>
          </div>
        </div>

        <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
          <p style={{ marginBottom: '1rem' }}>
            <strong>"Preconception: Building the Foundation for a Healthy Mother & a Healthy Future"</strong>
          </p>

          <p style={{ marginBottom: '1rem' }}>
            This application is a digital pre-consultation information collection and risk-screening assistant designed for couples and obstetricians/gynaecologists. It is built strictly on the clinical authority of:
          </p>

          <div style={{ background: 'var(--surface-alt)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', borderLeft: '4px solid var(--primary-600)' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
              1. FOGSI Safe Motherhood Committee Preconception Care E-Booklet, Book 1
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
              Editor-in-Chief: Dr. Bhaskar Pal (President, FOGSI) • Editors: Dr. Suvarna Khadilkar (Secretary General, FOGSI), Dr. Priti Kumar (Vice President, FOGSI), Dr. Poonam Goyal (Chairperson, Safe Motherhood Committee)
            </div>
            <div style={{ fontWeight: 700, marginTop: '0.5rem', marginBottom: '0.25rem' }}>
              2. FOGSI Preconception Care — Complete Clinician Checklist
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
              Comprehensive 12-point clinical protocol covering medical, surgical, obstetric, genetic, occupational, nutritional, and immunisation history.
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', color: 'var(--primary-700)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={18} />
            <span>Strict Medical Safety Principles</span>
          </h4>

          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '1.25rem' }}>
            <li style={{ marginBottom: '0.4rem' }}>
              <strong>Pre-consultation Assistant Only:</strong> The application does NOT diagnose conditions, prescribe medications, or replace clinician judgment.
            </li>
            <li style={{ marginBottom: '0.4rem' }}>
              <strong>Non-Alarmist Flagging:</strong> Responses are categorized into neutral reminders (<em>"Topics flagged for clinician review"</em>) rather than automated risk scores.
            </li>
            <li style={{ marginBottom: '0.4rem' }}>
              <strong>Medication Safety:</strong> Never independently instructs a patient to discontinue medication (especially psychotropic, antihypertensive, or anti-epileptic drugs), avoiding hazardous withdrawal relapses.
            </li>
            <li style={{ marginBottom: '0.4rem' }}>
              <strong>Evidence-Based Folic Acid Guidance:</strong> Reflects explicit FOGSI dosing (400–800 μg low risk; 4–5 mg high risk 1–3 months prior to conception).
            </li>
          </ul>

          <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
            <button className="btn-primary-lg" style={{ width: '100%' }} onClick={onClose} type="button">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
