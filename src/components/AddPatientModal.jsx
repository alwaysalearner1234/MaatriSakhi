import React, { useState, useEffect } from 'react';
import { X, UserPlus, Calendar, Heart, Shield, ArrowRight, Check } from 'lucide-react';

export default function AddPatientModal({ isOpen, onClose, onSavePatient, onSaveAndStartAssessment }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    age: '',
    address: '',
    city: '',
    marriageDate: '',
    yearsMarried: '',
    previousMarriage: 'no',
    partnerName: '',
    doctorDescription: ''
  });

  const [errors, setErrors] = useState({});

  // Auto-calculate Age from Date of Birth
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge >= 0 && calculatedAge < 120) {
        setFormData(prev => ({ ...prev, age: calculatedAge }));
      }
    }
  }, [formData.dob]);

  // Auto-calculate Years Married from Date of Marriage
  useEffect(() => {
    if (formData.marriageDate) {
      const mDate = new Date(formData.marriageDate);
      const today = new Date();
      let years = today.getFullYear() - mDate.getFullYear();
      const monthDiff = today.getMonth() - mDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < mDate.getDate())) {
        years--;
      }
      if (years >= 0) {
        setFormData(prev => ({ ...prev, yearsMarried: Math.max(0, years) }));
      }
    }
  }, [formData.marriageDate]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Patient name is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    return errs;
  };

  const handleSave = (startNow = false) => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const patientId = `PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient = {
      id: patientId,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      dob: formData.dob,
      age: formData.age || 26,
      address: formData.address.trim(),
      city: formData.city.trim(),
      marriageDate: formData.marriageDate,
      yearsMarried: formData.yearsMarried !== '' ? Number(formData.yearsMarried) : 1,
      previousMarriage: formData.previousMarriage,
      partnerName: formData.partnerName.trim(),
      doctorDescription: formData.doctorDescription.trim(),
      status: 'New',
      assessmentsCount: 0,
      assessments: [],
      answers: {},
      isDemo: false,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    if (startNow) {
      onSaveAndStartAssessment(newPatient);
    } else {
      onSavePatient(newPatient);
    }
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-container add-patient-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="modal-badge-icon">
              <UserPlus size={20} color="#e11d48" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>+ Add New Patient</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Create structured patient record before starting preconception assessment
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} type="button" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="modal-body-scrollable">
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="form-section-block">
            <h3 className="form-section-title">1. Basic Information</h3>
            <div className="form-grid-2">
              <div className="form-field">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Radhika Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="field-error-text">{errors.name}</span>}
              </div>

              <div className="form-field">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && <span className="field-error-text">{errors.phone}</span>}
              </div>

              <div className="form-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>Age (Auto-calculated)</label>
                <input
                  type="number"
                  placeholder="e.g. 27"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  readOnly={!!formData.dob}
                  style={{ background: formData.dob ? '#f1f5f9' : 'white' }}
                />
              </div>

              <div className="form-field">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="Street / Flat / Locality"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>City</label>
                <input
                  type="text"
                  placeholder="e.g. Pune, Mumbai, Bangalore"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: MARITAL INFORMATION */}
          <div className="form-section-block">
            <h3 className="form-section-title">2. Marital Information</h3>
            <div className="form-grid-2">
              <div className="form-field">
                <label>Date of Marriage</label>
                <input
                  type="date"
                  value={formData.marriageDate}
                  onChange={(e) => setFormData({ ...formData, marriageDate: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>Years Married (Auto-calculated)</label>
                <input
                  type="number"
                  placeholder="e.g. 2"
                  value={formData.yearsMarried}
                  onChange={(e) => setFormData({ ...formData, yearsMarried: e.target.value })}
                  readOnly={!!formData.marriageDate}
                  style={{ background: formData.marriageDate ? '#f1f5f9' : 'white' }}
                />
              </div>

              <div className="form-field" style={{ gridColumn: 'span 2' }}>
                <label>Previous Marriage?</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem' }}>
                  <label className="radio-pill-label">
                    <input
                      type="radio"
                      name="previousMarriage"
                      value="no"
                      checked={formData.previousMarriage === 'no'}
                      onChange={() => setFormData({ ...formData, previousMarriage: 'no' })}
                    />
                    <span>NO (First marriage)</span>
                  </label>
                  <label className="radio-pill-label">
                    <input
                      type="radio"
                      name="previousMarriage"
                      value="yes"
                      checked={formData.previousMarriage === 'yes'}
                      onChange={() => setFormData({ ...formData, previousMarriage: 'yes' })}
                    />
                    <span>YES (History of previous marriage)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: PARTNER INFORMATION */}
          <div className="form-section-block">
            <h3 className="form-section-title">3. Partner Information</h3>
            <div className="form-field">
              <label>Partner / Husband's Name (Optional where appropriate)</label>
              <input
                type="text"
                placeholder="e.g. Rohan Sharma"
                value={formData.partnerName}
                onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
              />
            </div>
          </div>

          {/* SECTION 4: DOCTOR'S DESCRIPTION (DOCTOR ONLY) */}
          <div className="form-section-block doctor-only-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <Shield size={16} color="#be123c" />
              <h3 className="form-section-title" style={{ margin: 0, color: '#be123c' }}>
                Doctor's Description / Initial Notes (Doctor-Only Field)
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#9f1239', marginBottom: '0.5rem' }}>
              This field is confidential to clinicians and kept strictly separate from patient questionnaire answers.
            </p>
            <div className="form-field">
              <textarea
                rows={4}
                placeholder="Add relevant background information, reason for visit, concerns, previous history or initial consultation notes..."
                value={formData.doctorDescription}
                onChange={(e) => setFormData({ ...formData, doctorDescription: e.target.value })}
                style={{ width: '100%', borderRadius: '8px', border: '1px solid #fecdd3', padding: '0.75rem', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="modal-footer">
          <button className="nav-pill-btn" onClick={onClose} type="button">
            Cancel
          </button>

          <button
            className="btn-secondary-clinical"
            onClick={() => handleSave(false)}
            type="button"
          >
            <Check size={16} />
            <span>Save Patient</span>
          </button>

          <button
            className="btn-primary-lg"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
            onClick={() => handleSave(true)}
            type="button"
          >
            <span>Save & Start Assessment</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
