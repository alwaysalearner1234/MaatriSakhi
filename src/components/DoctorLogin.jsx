import React, { useState } from 'react';
import { Stethoscope, Lock, Mail, ArrowRight, Sparkles, Shield, ArrowLeft } from 'lucide-react';

export default function DoctorLogin({ onLoginSuccess, onBackToHome }) {
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e?.preventDefault();
    if (!doctorId.trim()) {
      setErrorMsg('Please enter your Doctor ID or Email');
      return;
    }
    setErrorMsg('');
    onLoginSuccess({
      name: doctorId.includes('@') ? 'Dr. Priya Desai, MD (OBGYN)' : `Dr. ${doctorId}`,
      id: doctorId || 'DOC-FOGSI-882',
      role: 'Consultant Obstetrician & Gynaecologist'
    });
  };

  const handleDemoDoctorLogin = () => {
    setDoctorId('dr.anita.fogsi@clinic.org');
    setPassword('••••••••••••');
    setErrorMsg('');
    setTimeout(() => {
      onLoginSuccess({
        name: 'Dr. Anita Joshi, MD, DGO (FOGSI)',
        id: 'DOC-FOGSI-402',
        role: 'Consultant Obstetrician & Gynaecologist'
      });
    }, 250);
  };

  return (
    <div className="doctor-login-page animate-fade-in">
      <div className="login-card-container">
        {/* Back Link */}
        <button
          className="back-link-btn"
          onClick={onBackToHome}
          type="button"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div className="login-card">
          <div className="login-card-header">
            <div className="login-icon-badge">
              <Stethoscope size={28} color="#e11d48" />
            </div>
            <h2>Doctor Portal</h2>
            <p>FOGSI Preconception Pre-Visit Clinician Management</p>
          </div>

          {errorMsg && (
            <div className="login-error-alert">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="doctorId">Doctor ID / Email</label>
              <div className="input-with-icon">
                <Mail size={18} color="var(--text-muted)" />
                <input
                  id="doctorId"
                  type="text"
                  placeholder="e.g. dr.anita@hospital.org or DOC-102"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <Lock size={18} color="var(--text-muted)" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter clinic password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="login-button-group">
              <button type="submit" className="btn-primary-lg" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Login</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="btn-demo-outline"
                onClick={handleDemoDoctorLogin}
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}
                id="btn-demo-doctor"
              >
                <Sparkles size={16} color="#e11d48" />
                <span>Demo Doctor (Instant Access)</span>
              </button>
            </div>
          </form>

          <div className="login-security-notice">
            <Shield size={14} color="var(--sage-600)" />
            <span>FOGSI Clinical Data Security • Prototype Mock Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
