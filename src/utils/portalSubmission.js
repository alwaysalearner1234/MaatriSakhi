// Portal submission builder — the portal form is the ONLY clinical source of truth.
// Every selected checkbox and every clinician note is preserved verbatim.
// Unselected checkboxes are OMITTED (never auto-negatives). Missing info stays missing.
// Backend (generator.py `submit`) converts this into structured source.json.

import { QUESTIONS } from '../data/fogsiQuestions';

function buildQuestionMeta() {
  const meta = {};
  const register = (q) => {
    if (!q || !q.id) return;
    let text = q.id;
    if (q.question && typeof q.question === 'object') {
      text = q.question.en || Object.values(q.question)[0] || q.id;
    } else if (typeof q.question === 'string') {
      text = q.question;
    }
    meta[q.id] = { text, section: q.section || 'medical' };
  };
  QUESTIONS.forEach((q) => {
    register(q);
    (q.followUps || []).forEach((sub) => {
      register(sub);
      (sub.followUps || []).forEach(register);
    });
  });
  return meta;
}

/**
 * Build the portal submission payload.
 * @param {object} params
 * @param {object} params.patient - { name, record_id }
 * @param {string} params.encounterDate - YYYY-MM-DD
 * @param {string} params.doctorDescription
 * @param {object} params.answers - { qId: value } (arrays for multi-select)
 * @param {Array} params.history
 * @param {object} params.sectionNotes
 * @param {object} params.extra - { examination, assessment, plan }
 */
export function buildPortalSubmission({
  patient = {},
  encounterDate = null,
  doctorDescription = '',
  answers = {},
  history = [],
  sectionNotes = {},
  extra = {},
} = {}) {
  const date = encounterDate || new Date().toISOString().slice(0, 10);
  return {
    portal: 'MaatriSakhi-preconception',
    portal_version: 1,
    patient: {
      name: patient?.name || 'Walk-In Patient',
      record_id: patient?.record_id || patient?.id || 'WALK-IN',
    },
    encounter: { date },
    doctor_description: doctorDescription || '',
    answers: { ...answers },
    history: Array.isArray(history) ? [...history] : [],
    section_notes: { ...(sectionNotes || {}) },
    extra: {
      examination: extra?.examination || '',
      assessment: extra?.assessment || '',
      plan: extra?.plan || '',
    },
    question_meta: buildQuestionMeta(),
  };
}

/**
 * Trigger a browser download of the portal submission JSON.
 * This file is the input to: python generator.py submit <file>
 */
export function downloadPortalSubmission(submission, patientName = 'Patient') {
  try {
    const safeName = (patientName || 'Patient').replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `portal_submission_${safeName}_${timestamp}.json`;
    const blob = new Blob([JSON.stringify(submission, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('[portal] portal submission received (browser) -> download started:', filename);
    return true;
  } catch (err) {
    console.error('[portal] failed to download portal submission:', err);
    return false;
  }
}
