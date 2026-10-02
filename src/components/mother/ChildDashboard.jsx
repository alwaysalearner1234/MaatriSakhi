import React, { useMemo, useState } from 'react';
import { Baby, TrendingUp, ShieldAlert, Save, AlertCircle, ArrowLeft } from 'lucide-react';
import { updateChild } from '../../utils/motherApi';
import './mother.css';

// Child dashboard:
//  a) baby's growth/health trackers (current weight/height, editable)
//  b) dedicated PRENATAL HISTORY section — inherited maternal environment,
//     read-only, highly visible as the baseline for monitoring.
export function PrenatalHistory({ env }) {
  if (!env) return null;
  const bpFlag = env.has_high_bp === true;
  const gdmFlag = env.has_gestational_diabetes === true;
  return (
    <section className="prenatal-box">
      <h3><ShieldAlert size={17} /> Prenatal History — 9-month environment (read-only baseline)</h3>
      <p className="mother-sub" style={{ margin: '0 0 .7rem' }}>
        Your baby grew in this environment for 9 months — it sets the tone for future health monitoring.
        This context is inherited from the linked pregnancy and cannot be edited here.
      </p>
      <div className="prenatal-grid">
        <div className={`prenatal-chip ${bpFlag ? 'flag' : 'ok'}`}>
          <strong>Maternal high BP</strong>
          <span>{env.has_high_bp == null ? 'Not recorded' : bpFlag ? 'YES — monitor child BP/growth closely' : 'No'}</span>
          {(env.bp_limit_systolic || env.bp_limit_diastolic) && (
            <em>Doctor limit: {env.bp_limit_systolic ?? '–'}/{env.bp_limit_diastolic ?? '–'} mmHg</em>
          )}
        </div>
        <div className={`prenatal-chip ${gdmFlag ? 'flag' : 'ok'}`}>
          <strong>Gestational diabetes</strong>
          <span>{env.has_gestational_diabetes == null ? 'Not recorded' : gdmFlag ? 'YES — monitor child weight/sugar closely' : 'No'}</span>
          {(env.sugar_limit_fasting || env.sugar_limit_post_meal) && (
            <em>Limits: fasting {env.sugar_limit_fasting ?? '–'} / post-meal {env.sugar_limit_post_meal ?? '–'} mg/dL</em>
          )}
        </div>
      </div>
    </section>
  );
}

export default function ChildDashboard({ child, pregnancy, onChildUpdated, onBack, onGoPregnancy }) {
  const env = child?.prenatal_environment || null;
  const [form, setForm] = useState({
    current_weight_kg: child?.current_weight_kg ?? '',
    current_height_cm: child?.current_height_cm ?? '',
    notes: child?.notes ?? '',
  });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const birthDate = child?.birth_date;
  const ageText = useMemo(() => {
    if (!birthDate) return '—';
    const days = Math.floor((Date.now() - new Date(birthDate).getTime()) / 86400000);
    if (days < 0) return '—';
    if (days < 30) return `${days} day${days === 1 ? '' : 's'} old`;
    const m = Math.floor(days / 30.46);
    return m < 24 ? `${m} month${m === 1 ? '' : 's'} old` : `${Math.floor(m / 12)}y ${m % 12}m old`;
  }, [birthDate]);

  const save = async () => {
    setErr(''); setMsg(''); setBusy(true);
    try {
      const updated = await updateChild(child.id, {
        current_weight_kg: form.current_weight_kg === '' ? null : Number(form.current_weight_kg),
        current_height_cm: form.current_height_cm === '' ? null : Number(form.current_height_cm),
        notes: form.notes || null,
      });
      onChildUpdated(updated);
      setMsg('Growth update saved ✓');
    } catch (e) {
      setErr(e.message || 'Could not save.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mother-wrap animate-fade-in">
      <div className="mother-card wide">
        <button type="button" className="mother-link" onClick={onBack}><ArrowLeft size={14} /> Back</button>
        <h2 className="mother-title"><Baby size={20} /> {child?.name || 'Baby'} — {ageText}</h2>
        <p className="mother-sub">
          Born {child?.birth_date || '—'} · {child?.birth_weight_kg ?? '—'} kg at birth
          {child?.gender ? ` · ${child.gender}` : ''} · linked pregnancy week {pregnancy?.current_week ?? '–'}
        </p>

        <PrenatalHistory env={env} />

        <section className="tracker">
          <h3><TrendingUp size={18} /> Growth tracker <em>birth → now</em></h3>
          <div className="growth-grid">
            <div className="growth-stat"><span>Birth weight</span><strong>{child?.birth_weight_kg ?? '—'} kg</strong></div>
            <div className="growth-stat"><span>Birth length</span><strong>{child?.birth_length_cm ?? '—'} cm</strong></div>
            <div className="growth-stat"><span>Current weight</span><strong>{child?.current_weight_kg ?? '—'} kg</strong></div>
            <div className="growth-stat"><span>Current height</span><strong>{child?.current_height_cm ?? '—'} cm</strong></div>
          </div>
          <div className="tracker-form" style={{ marginTop: '.8rem' }}>
            <input type="number" step="0.01" placeholder="Current weight (kg)" value={form.current_weight_kg}
              onChange={(e) => setForm({ ...form, current_weight_kg: e.target.value })} />
            <input type="number" step="0.1" placeholder="Current height (cm)" value={form.current_height_cm}
              onChange={(e) => setForm({ ...form, current_height_cm: e.target.value })} />
            <input placeholder="Health note (feeding, vaccines…)" value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ gridColumn: '1 / -1' }} />
            <button type="button" className="btn-primary-lg" onClick={save} disabled={busy} style={{ gridColumn: '1 / -1', justifyContent: 'center' }}>
              <Save size={15} /> {busy ? 'Saving…' : 'Save growth update'}
            </button>
          </div>
          {msg && <div className="mother-ok">{msg}</div>}
          {err && <div className="mother-error"><AlertCircle size={15} /> {err}</div>}
        </section>

        <button type="button" className="mother-link" onClick={onGoPregnancy}>
          View linked pregnancy profile →
        </button>
      </div>
    </div>
  );
}
