import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Heart,
  FileText,
  Clock,
  Play,
  Eye,
  History,
  PlusCircle,
  Edit2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { generateClinicianFlags } from '../data/fogsiQuestions';

export default function PatientProfileView({
  patient,
  onStartAssessment,
  onViewAssessment,
  onOpenAssessmentHistory,
  onAddDoctorNote,
  onEditPatient,
  onBackToPatientsList
}) {
  if (!patient) {
    return <div className="doctor-portal-container">No patient selected.</div>;
  }

  const assessments = patient.assessments || [];
  const latestAssessment = assessments[0] || (patient.answers && Object.keys(patient.answers).length > 0 ? {
    id: `ASM-${patient.id}-1`,
    date: patient.completedAt || 'Recently',
    status: patient.status || 'Completed',
    answers: patient.answers
  } : null);

  const flags = latestAssessment ? generateClinicianFlags(latestAssessment.answers || {}) : [];
  const attentionCount = flags.filter(f => f.level === 'attention').length;
  const reviewCount = flags.filter(f => f.level === 'review').length;

  return (
    <div className="patient-profile-container animate-fade-in">
      {/* Top breadcrumb & back */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <button
          className="back-link-btn"
          onClick={onBackToPatientsList}
          type="button"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}
        >
          <span>← Back to Patients List</span>
        </button>

        {patient.isDemo && (
          <span className="demo-data-badge">
            DEMO DATA — NOT A REAL PATIENT
          </span>
        )}
      </div>

      {/* Patient Profile Card */}
      <div className="profile-hero-card">
        <div className="profile-hero-main">
          <div className="profile-avatar-circle">
            <User size={36} color="#e11d48" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>{patient.name}</h1>
              <span className="patient-id-tag">{patient.id}</span>
              <span className={`status-badge-pill status-${(patient.status || 'new').toLowerCase().replace(' ', '-')}`}>
                {patient.status || 'New'}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Age: <strong>{patient.age ? `${patient.age} Years` : 'Unspecified'}</strong> • Phone: <strong>{patient.phone || 'Not provided'}</strong>
            </p>
          </div>
        </div>

        {/* Quick Profile Actions Bar */}
        <div className="profile-actions-bar">
          <button
            className="btn-primary-lg"
            style={{ padding: '0.6rem 1.15rem', fontSize: '0.88rem' }}
            onClick={() => onStartAssessment(patient)}
            type="button"
            id="btn-start-patient-assessment"
          >
            <Play size={15} />
            <span>Start Assessment</span>
          </button>

          {latestAssessment && (
            <button
              className="btn-secondary-clinical"
              onClick={() => onViewAssessment(patient, latestAssessment)}
              type="button"
              id="btn-view-assessment"
            >
              <Eye size={15} />
              <span>View Assessment</span>
            </button>
          )}

          <button
            className="nav-pill-btn"
            onClick={() => onOpenAssessmentHistory(patient)}
            type="button"
          >
            <History size={15} />
            <span>Assessment History ({assessments.length || (latestAssessment ? 1 : 0)})</span>
          </button>

          <button
            className="nav-pill-btn"
            onClick={() => onAddDoctorNote(patient)}
            type="button"
          >
            <PlusCircle size={15} />
            <span>Add Doctor Note</span>
          </button>
        </div>
      </div>

      {/* Demographic & Marital Details Grid */}
      <div className="profile-details-grid">
        <div className="profile-detail-card">
          <div className="card-subhead">
            <User size={16} color="var(--primary-600)" />
            <span>Basic & Contact Information</span>
          </div>
          <div className="detail-kv-list">
            <div className="detail-kv-row">
              <span className="kv-label">Full Name:</span>
              <strong className="kv-value">{patient.name}</strong>
            </div>
            <div className="detail-kv-row">
              <span className="kv-label">Age / DOB:</span>
              <strong className="kv-value">
                {patient.age} Years {patient.dob ? `(DOB: ${patient.dob})` : ''}
              </strong>
            </div>
            <div className="detail-kv-row">
              <span className="kv-label">Phone:</span>
              <strong className="kv-value">{patient.phone}</strong>
            </div>
            <div className="detail-kv-row">
              <span className="kv-label">Address:</span>
              <span className="kv-value">{patient.address ? `${patient.address}, ${patient.city || ''}` : 'Not recorded'}</span>
            </div>
          </div>
        </div>

        <div className="profile-detail-card">
          <div className="card-subhead">
            <Heart size={16} color="var(--primary-600)" />
            <span>Marital & Partner Information</span>
          </div>
          <div className="detail-kv-list">
            <div className="detail-kv-row">
              <span className="kv-label">Date of Marriage:</span>
              <strong className="kv-value">{patient.marriageDate || 'Not specified'}</strong>
            </div>
            <div className="detail-kv-row">
              <span className="kv-label">Years Married:</span>
              <strong className="kv-value">
                {patient.yearsMarried !== undefined && patient.yearsMarried !== '' ? `${patient.yearsMarried} Year${patient.yearsMarried === 1 ? '' : 's'}` : 'Not recorded'}
              </strong>
            </div>
            <div className="detail-kv-row">
              <span className="kv-label">Previous Marriage:</span>
              <strong className="kv-value">
                {patient.previousMarriage === 'yes' ? 'YES (Reported)' : 'No (First marriage)'}
              </strong>
            </div>
            <div className="detail-kv-row">
              <span className="kv-label">Partner's Name:</span>
              <span className="kv-value">{patient.partnerName || 'Not specified'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor's Initial Description (Doctor-Only Field) */}
      <div className="profile-doctor-description-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <FileText size={18} color="#be123c" />
          <h3 style={{ fontSize: '1rem', color: '#be123c' }}>Doctor's Description / Initial Notes</h3>
          <span style={{ fontSize: '0.75rem', background: '#ffe4e6', color: '#be123c', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
            Doctor-Only
          </span>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
          {patient.doctorDescription || 'No initial clinical background notes added by the doctor yet.'}
        </p>
      </div>

      {/* Assessment History Section */}
      <div className="profile-assessment-history-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={18} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>Assessment History</h3>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Each assessment is stored separately
          </span>
        </div>

        {assessments.length === 0 && !latestAssessment ? (
          <div className="empty-history-card">
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              No preconception assessment has been conducted for this patient yet.
            </p>
            <button
              className="btn-primary-lg"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              onClick={() => onStartAssessment(patient)}
              type="button"
            >
              Start First Assessment
            </button>
          </div>
        ) : (
          <div className="history-records-list">
            {(assessments.length > 0 ? assessments : [latestAssessment]).map((asm, idx) => {
              const asmFlags = generateClinicianFlags(asm.answers || {});
              const asmAttention = asmFlags.filter(f => f.level === 'attention').length;
              const asmReview = asmFlags.filter(f => f.level === 'review').length;
              const totalFlags = asmAttention + asmReview;

              return (
                <div key={asm.id || idx} className="history-record-card">
                  <div className="history-meta">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Clock size={16} color="var(--text-muted)" />
                      <strong>{asm.date || 'Recent Assessment'}</strong>
                      <span className="asm-id-pill">{asm.id || `ASM-${idx + 1}`}</span>
                    </div>
                    <div style={{ marginTop: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Status: <strong style={{ color: 'var(--sage-700)' }}>{asm.status || 'Completed'}</strong> • Language: {asm.language || 'English'}
                    </div>
                  </div>

                  <div className="history-flags-preview">
                    {totalFlags > 0 ? (
                      <span className="flag-count-pill" style={{ background: asmAttention > 0 ? '#fee2e2' : '#fef3c7', color: asmAttention > 0 ? '#991b1b' : '#92400e' }}>
                        {asmAttention > 0 ? '🔴' : '🟡'} {totalFlags} topic{totalFlags === 1 ? '' : 's'} for review
                      </span>
                    ) : (
                      <span className="flag-count-pill" style={{ background: '#dcfce7', color: '#166534' }}>
                        🟢 Routine (No risk flags)
                      </span>
                    )}
                  </div>

                  <div>
                    <button
                      className="btn-secondary-clinical"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                      onClick={() => onViewAssessment(patient, asm)}
                      type="button"
                    >
                      <Eye size={14} />
                      <span>View Summary</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Doctor Notes History */}
      {patient.notes && patient.notes.length > 0 && (
        <div className="profile-doctor-notes-section">
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            Recorded Doctor Consultation Notes
          </h3>
          <div className="notes-timeline">
            {patient.notes.map((n, idx) => (
              <div key={idx} className="doctor-note-item">
                <div className="note-item-meta">
                  <strong>{n.doctor || 'Doctor'}</strong> • <span>{n.date}</span>
                </div>
                <div className="note-item-text">{n.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
