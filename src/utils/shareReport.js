// Shareable assessment report for the patient.
// Builds a plain-text pre-visit summary, then shares it in the best way
// available: (1) native OS share sheet (WhatsApp, email…), else (2) upload to
// /uploads and return an openable link, else (3) plain download.
import { uploadAttachment, API_BASE_URL } from './motherApi';

export function buildShareText({ patient = {}, assessment = {}, flags = [], answers = {} }) {
  const lines = [
    'MaatriSakhi — Pre-visit Summary (for the patient)',
    `Patient: ${patient.name || 'Patient'}`,
    `Date: ${assessment.date || assessment.isoDate || new Date().toLocaleDateString('en-GB')}`,
    '',
  ];
  const answered = Object.keys(answers || {}).length;
  if (answered) lines.push(`Questions answered: ${answered}`);
  const important = (flags || []).filter((f) => f.level === 'attention' || f.level === 'review');
  if (important.length) {
    lines.push('', 'Please discuss with your doctor:');
    important.slice(0, 8).forEach((f) => lines.push(`- ${f.title || f.id}`));
  }
  const notes = assessment.sectionNotes || {};
  const noteKeys = Object.keys(notes).filter((k) => String(notes[k] || '').trim());
  if (noteKeys.length) {
    lines.push('', "Doctor's notes:");
    noteKeys.forEach((k) => lines.push(`- ${k}: ${String(notes[k]).trim()}`));
  }
  lines.push(
    '',
    'This summary helps you prepare for your consultation. It is not a diagnosis.'
  );
  return lines.join('\n');
}

export function absoluteShareUrl(url) {
  if (!url) return null;
  if (/^https?:/.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export async function shareReportFile({ filename, text }) {
  const file = new File([text], filename, { type: 'text/plain' });
  // 1) Native share sheet (mobile → WhatsApp / email / …)
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'MaatriSakhi pre-visit summary' });
      return { shared: true };
    }
  } catch (err) {
    if (err?.name === 'AbortError') return { dismissed: true };
    // fall through to link-based sharing
  }
  // 2) Upload → openable link the patient can tap
  const att = await uploadAttachment(file, { allowText: true });
  if (!att.file_path) throw new Error('Sharing needs the backend — file saved as download instead.');
  return { shared: false, url: absoluteShareUrl(att.url || att.file_path), name: att.name };
}

export function whatsappLink(url, patientName = 'Patient') {
  return `https://wa.me/?text=${encodeURIComponent(
    `Hello ${patientName}, here is your MaatriSakhi pre-visit summary: ${url}`
  )}`;
}
