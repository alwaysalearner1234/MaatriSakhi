import React, { useEffect, useMemo, useState } from 'react';
import { HeartPulse, Droplet, CalendarClock, Plus, AlertCircle, RotateCcw, Baby, PartyPopper, Paperclip } from 'lucide-react';
import { trackerFlags, daysUntilVisit, createEntry, listEntries, saveConsent, shouldPromptChildCard, resolveAttachmentUrl } from '../../utils/motherApi';
import AttachmentInput from '../common/AttachmentInput';
import './mother.css';

function entryFileLink(e) {
  const ref = e.file_path ? { url: e.file_path } : e.localUrl ? { url: e.localUrl } : null;
  const url = ref && resolveAttachmentUrl(ref);
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="attach-view-link" title="Open attached file">
      <Paperclip size={12} /> file
    </a>
  );
}

// Conditional trackers:
//  - BP tracker visible IFF has_high_bp OR doctor BP limit set
//  - Sugar tracker visible IFF has_gestational_diabetes OR doctor sugar limit set
// Tracker data -> Entry table. next_visit_date drives the Visit countdown.
// Birth transition: full-term (>=37w) or "baby born" button prompts Child Health Card creation.
export default function PregnancyDashboard({ mother, pregnancy, onUpdateMother, onBack, child, onCreateChild, onOpenChild }) {
  const { bpOn, sugarOn } = useMemo(() => trackerFlags(pregnancy), [pregnancy]);
  const [entries, setEntries] = useState([]);
  const [bp, setBp] = useState({ sys: '', dia: '', note: '' });
  const [sugar, setSugar] = useState({ value: '', kind: 'fasting', note: '' });
  const [bpFiles, setBpFiles] = useState([]);
  const [sugarFiles, setSugarFiles] = useState([]);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (pregnancy?.id && !String(pregnancy.id).startsWith('preg-')) {
      listEntries(pregnancy.id).then(setEntries).catch(() => {});
    }
  }, [pregnancy?.id]);

  const days = daysUntilVisit(pregnancy?.next_visit_date);
  const bpRows = entries.filter((e) => e.type === 'bp');
  const sugarRows = entries.filter((e) => e.type === 'sugar');

  const pushLocal = (row) => setEntries((p) => [row, ...p]);

  const addBp = async () => {
    setErr(''); setMsg('');
    const sys = Number(bp.sys), dia = Number(bp.dia);
    if (!sys || !dia) return setErr('Enter both systolic and diastolic values.');
    const file = bpFiles[0] || null;
    const row = await createEntry({
      pregnancy_id: pregnancy.id, type: 'bp',
      value_json: { systolic: sys, diastolic: dia }, note: bp.note || null,
      file_path: file?.file_path || null,
    }).catch((e) => { setErr(e.message); return null; });
    if (row) {
      if (file?.local) row.localUrl = file.url;
      if (row.offline || String(pregnancy.id).startsWith('preg-')) pushLocal(row);
      else setEntries(await listEntries(pregnancy.id).catch(() => entries));
      const over =
        (pregnancy.bp_limit_systolic && sys > pregnancy.bp_limit_systolic) ||
        (pregnancy.bp_limit_diastolic && dia > pregnancy.bp_limit_diastolic);
      setMsg(over ? '⚠️ Above your doctor-set BP limit — please contact your doctor.' : 'BP saved ✓');
      setBp({ sys: '', dia: '', note: '' });
      setBpFiles([]);
    }
  };

  const addSugar = async () => {
    setErr(''); setMsg('');
    const v = Number(sugar.value);
    if (!v) return setErr('Enter your sugar value (mg/dL).');
    const file = sugarFiles[0] || null;
    const row = await createEntry({
      pregnancy_id: pregnancy.id, type: 'sugar',
      value_json: { mg_dl: v, kind: sugar.kind }, note: sugar.note || null,
      file_path: file?.file_path || null,
    }).catch((e) => { setErr(e.message); return null; });
    if (row) {
      if (file?.local) row.localUrl = file.url;
      if (row.offline || String(pregnancy.id).startsWith('preg-')) pushLocal(row);
      else setEntries(await listEntries(pregnancy.id).catch(() => entries));
      const lim = sugar.kind === 'fasting' ? pregnancy.sugar_limit_fasting : pregnancy.sugar_limit_post_meal;
      setMsg(lim && v > lim ? '⚠️ Above your doctor-set sugar limit — please contact your doctor.' : 'Sugar saved ✓');
      setSugar({ value: '', kind: 'fasting', note: '' });
      setSugarFiles([]);
    }
  };

  const revoke = async () => {
    if (!window.confirm('Revoke consent? Health tracking will pause.')) return;
    const res = await saveConsent(false).catch((e) => { setErr(e.message); return null; });
    if (res) onUpdateMother({ ...mother, consent_given: false, consent_at: res.consent_at });
  };

  return (
    <div className="mother-wrap animate-fade-in">
      <div className="mother-card wide">
        <button type="button" className="mother-link" onClick={onBack}>← Home</button>
        <h2 className="mother-title">Your pregnancy dashboard 🤰 — week {pregnancy?.current_week ?? '–'}</h2>

        <div className="visit-banner">
          <CalendarClock size={18} />
          {pregnancy?.next_visit_date ? (
            <span>Next doctor visit: <strong>{pregnancy.next_visit_date}</strong>
              {days != null && (days >= 0 ? ` — in ${days} day${days === 1 ? '' : 's'}. Bring your tracker readings!` : ` — ${Math.abs(days)} day(s) ago. Please reschedule.`)}
            </span>
          ) : (<span>No visit date set — add one so we can prepare your visit summary.</span>)}
        </div>

        {/* Transition: pregnancy -> Child Health Card */}
        {child ? (
          <div className="birth-banner">
            <Baby size={18} />
            <span><strong>{child.name}</strong>'s Child Health Card is ready — prenatal context inherited ✓</span>
            <button type="button" className="btn-primary-lg" onClick={onOpenChild}>Open card</button>
          </div>
        ) : (
          <div className="birth-banner">
            <PartyPopper size={18} />
            <span>{shouldPromptChildCard(pregnancy)
              ? '🎉 Full term reached! Create the Child Health Card now — it inherits your BP/diabetes history as baseline.'
              : 'Baby born? Create the Child Health Card — it inherits your 9-month prenatal environment.'}</span>
            <button type="button" className="btn-primary-lg" onClick={onCreateChild}>👶 Baby born — create card</button>
          </div>
        )}

        {!bpOn && !sugarOn && (
          <div className="setup-trackers-empty">
            No condition flags in your profile, so no daily trackers are needed right now. Your visit countdown above stays active.
          </div>
        )}

        {bpOn && (
          <section className="tracker">
            <h3><HeartPulse size={18} /> BP tracker
              {(pregnancy.bp_limit_systolic || pregnancy.bp_limit_diastolic) && (
                <em> limit: {pregnancy.bp_limit_systolic ?? '–'}/{pregnancy.bp_limit_diastolic ?? '–'} mmHg</em>
              )}
            </h3>
            <div className="tracker-form">
              <input type="number" placeholder="Systolic (e.g. 120)" value={bp.sys} onChange={(e) => setBp({ ...bp, sys: e.target.value })} />
              <input type="number" placeholder="Diastolic (e.g. 80)" value={bp.dia} onChange={(e) => setBp({ ...bp, dia: e.target.value })} />
              <input placeholder="Note (optional)" value={bp.note} onChange={(e) => setBp({ ...bp, note: e.target.value })} />
              <button type="button" className="btn-primary-lg" onClick={addBp}><Plus size={15} /> Save BP</button>
            </div>
            <AttachmentInput attachments={bpFiles} onChange={setBpFiles} max={1} compact />
            <ul className="tracker-list">
              {bpRows.map((e) => (
                <li key={e.id}>{e.value_json?.systolic}/{e.value_json?.diastolic} mmHg — {new Date(e.created_at).toLocaleString()}{e.note ? ` — ${e.note}` : ''} {entryFileLink(e)}</li>
              ))}
              {!bpRows.length && <li className="muted">No BP entries yet.</li>}
            </ul>
          </section>
        )}

        {sugarOn && (
          <section className="tracker">
            <h3><Droplet size={18} /> Sugar tracker
              {(pregnancy.sugar_limit_fasting || pregnancy.sugar_limit_post_meal) && (
                <em> limits: fasting {pregnancy.sugar_limit_fasting ?? '–'} / post-meal {pregnancy.sugar_limit_post_meal ?? '–'} mg/dL</em>
              )}
            </h3>
            <div className="tracker-form">
              <input type="number" placeholder="mg/dL (e.g. 132)" value={sugar.value} onChange={(e) => setSugar({ ...sugar, value: e.target.value })} />
              <select value={sugar.kind} onChange={(e) => setSugar({ ...sugar, kind: e.target.value })}>
                <option value="fasting">Fasting</option>
                <option value="post_meal">Post-meal</option>
              </select>
              <input placeholder="Note (optional)" value={sugar.note} onChange={(e) => setSugar({ ...sugar, note: e.target.value })} />
              <button type="button" className="btn-primary-lg" onClick={addSugar}><Plus size={15} /> Save sugar</button>
            </div>
            <AttachmentInput attachments={sugarFiles} onChange={setSugarFiles} max={1} compact />
            <ul className="tracker-list">
              {sugarRows.map((e) => (
                <li key={e.id}>{e.value_json?.mg_dl} mg/dL ({e.value_json?.kind}) — {new Date(e.created_at).toLocaleString()}{e.note ? ` — ${e.note}` : ''} {entryFileLink(e)}</li>
              ))}
              {!sugarRows.length && <li className="muted">No sugar entries yet.</li>}
            </ul>
          </section>
        )}

        {msg && <div className="mother-ok">{msg}</div>}
        {err && <div className="mother-error"><AlertCircle size={15} /> {err}</div>}

        <button type="button" className="mother-link danger" onClick={revoke}>
          <RotateCcw size={14} /> Revoke consent (pause tracking)
        </button>
      </div>
    </div>
  );
}
