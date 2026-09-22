// Assessment JSON Generator and Analytics utility
// Strictly uses actual questions and selected answers from the existing application.
// No invented questions, answers, or medical conclusions.

import { SECTIONS_META, QUESTIONS, generateClinicianFlags } from '../data/fogsiQuestions';
import { UI_TRANSLATIONS } from '../data/translations';
import { formatAnswerValue } from './answerFormatter';

/**
 * Calculates analytics based strictly on the selected answers.
 */
export function calculateAssessmentAnalytics(answers = {}, history = []) {
  const answeredKeys = Object.keys(answers);
  const total_answered = answeredKeys.length || history.length;

  let yes = 0;
  let no = 0;
  let not_sure = 0;
  let other = 0;

  // Count YES / NO / NOT SURE
  answeredKeys.forEach(k => {
    const val = answers[k];
    if (val === 'yes') yes++;
    else if (val === 'no') no++;
    else if (val === 'not_sure') not_sure++;
    else other++;
  });

  // Calculate clinical flags from existing answers
  const flags = generateClinicianFlags(answers);
  const flagged = flags.filter(f => f.level === 'attention' || f.level === 'review').length;

  // Section-wise answer summary
  const section_summary = SECTIONS_META.map(sec => {
    // Find all questions in this section
    const secQuestions = QUESTIONS.filter(q => q.section === sec.id);
    const followUps = QUESTIONS.flatMap(q => q.followUps || []).filter(sub => sub.section === sec.id);
    const allSecQuestions = [...secQuestions, ...followUps];

    let secTotal = 0;
    let secYes = 0;
    let secNo = 0;
    let secNotSure = 0;

    allSecQuestions.forEach(q => {
      if (answers[q.id] !== undefined) {
        secTotal++;
        const v = answers[q.id];
        if (v === 'yes') secYes++;
        else if (v === 'no') secNo++;
        else if (v === 'not_sure') secNotSure++;
      }
    });

    return {
      section_id: sec.id,
      section_title: UI_TRANSLATIONS?.en?.sections?.[sec.id] || sec?.title?.en || sec.id,
      total_answered: secTotal,
      yes: secYes,
      no: secNo,
      not_sure: secNotSure
    };
  }).filter(s => s.total_answered > 0);

  return {
    total_answered,
    yes,
    no,
    not_sure,
    flagged,
    section_summary
  };
}

/**
 * Generates the standardized JSON representation of the completed assessment.
 * Strictly adheres to the Doctor-led assessment structure:
 * {
 *   patient: { name, phone, address, ... },
 *   assessment: { date, status },
 *   sections: [
 *     {
 *       name: "Obstetric History",
 *       answers: [{ question, answer }],
 *       notes: "..."
 *     }
 *   ],
 *   analytics: { total_answered, yes, no, not_sure }
 * }
 */
export function generateAssessmentJson({
  patient,
  history = [],
  answers = {},
  sectionNotes = {},
  questionNotes = {}, // backwards compatibility
  assessmentDate = null,
  assessmentStatus = 'completed'
}) {
  const analytics = calculateAssessmentAnalytics(answers, history);

  // Group questions and doctor-selected answers by section
  const sectionsArray = SECTIONS_META.map(sec => {
    // Find all questions belonging to this section from QUESTIONS (including followUps)
    const secQuestions = [
      ...QUESTIONS.filter(q => q.section === sec.id),
      ...QUESTIONS.flatMap(q => q.followUps || []).filter(sub => sub.section === sec.id)
    ];

    const formattedAnswers = [];
    secQuestions.forEach(q => {
      if (answers[q.id] !== undefined) {
        const val = answers[q.id];
        let formattedAnswer = formatAnswerValue(val);
        if (val === 'yes') formattedAnswer = 'YES';
        else if (val === 'no') formattedAnswer = 'NO';
        else if (val === 'not_sure') formattedAnswer = 'NOT SURE';

        const histItem = history.find(h => h.questionId === q.id);
        const qText = histItem?.questionText || q.question?.en || q.id;

        formattedAnswers.push({
          question: qText,
          answer: formattedAnswer
        });
      }
    });

    // Get the ONE notes field for this section
    const secNote = sectionNotes[sec.id] || (
      // Fallback if legacy question notes exist in this section
      secQuestions.map(q => questionNotes[q.id]).filter(Boolean).join('; ')
    ) || null;

    const sectionTitle = UI_TRANSLATIONS.en.sections[sec.id] || sec.id;

    return {
      name: sectionTitle,
      answers: formattedAnswers,
      notes: secNote ? String(secNote).trim() : null
    };
  }).filter(sec => sec.answers.length > 0 || sec.notes);

  return {
    patient: {
      name: patient?.name || 'Patient',
      phone: patient?.phone || '',
      address: patient?.address || patient?.city || 'Local Clinic Visit',
      description: patient?.doctorDescription || patient?.description || ''
    },
    assessment: {
      date: assessmentDate || new Date().toISOString(),
      status: assessmentStatus
    },
    sections: sectionsArray,
    analytics: {
      total_answered: analytics.total_answered,
      yes: analytics.yes,
      no: analytics.no,
      not_sure: analytics.not_sure
    }
  };
}

/**
 * Triggers a browser download of the assessment JSON file.
 */
export function downloadAssessmentJson(jsonPayload, patientName = 'Patient') {
  try {
    const safeName = (patientName || 'Patient').replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `Preconception_Assessment_${safeName}_${timestamp}.json`;

    const blob = new Blob([JSON.stringify(jsonPayload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Error downloading JSON:', err);
    return false;
  }
}
