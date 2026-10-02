// "I'm pregnant" profile questions — rendered ONE at a time
// by PregnancySetupFlow (same UX pattern as the existing preconception chat).
export const PREGNANCY_QUESTIONS = [
  { id: 'current_week', kind: 'number', required: true, min: 1, max: 42,
    title: 'What is your current week of pregnancy?',
    hint: 'Enter a week between 1 and 42.', placeholder: 'e.g. 24' },
  { id: 'next_visit_date', kind: 'date', required: false,
    title: 'When is your next doctor visit?',
    hint: 'Pick the date on your prescription / appointment slip.' },
  { id: 'has_high_bp', kind: 'yes_no', required: true,
    title: 'Do you have high BP?',
    hint: 'Answer YES if a doctor ever told you your BP is high.' },
  { id: 'bp_limit_systolic', kind: 'number', required: false, min: 50, max: 250,
    showIf: (a) => a.has_high_bp === 'yes',
    title: "Doctor's BP safety limit — systolic (upper number)?",
    hint: 'Ask your doctor, e.g. 140. Leave blank if not given.', placeholder: 'e.g. 140' },
  { id: 'bp_limit_diastolic', kind: 'number', required: false, min: 30, max: 150,
    showIf: (a) => a.has_high_bp === 'yes',
    title: "Doctor's BP safety limit — diastolic (lower number)?",
    hint: 'Ask your doctor, e.g. 90. Leave blank if not given.', placeholder: 'e.g. 90' },
  { id: 'has_gestational_diabetes', kind: 'yes_no', required: true,
    title: 'Do you have gestational diabetes?',
    hint: 'Answer YES if you were diagnosed during this pregnancy.' },
  { id: 'sugar_limit_fasting', kind: 'number', required: false, min: 40, max: 400,
    showIf: (a) => a.has_gestational_diabetes === 'yes',
    title: "Doctor's sugar safety limit — fasting (mg/dL)?",
    hint: 'Ask your doctor, e.g. 95. Leave blank if not given.', placeholder: 'e.g. 95' },
  { id: 'sugar_limit_post_meal', kind: 'number', required: false, min: 40, max: 600,
    showIf: (a) => a.has_gestational_diabetes === 'yes',
    title: "Doctor's sugar safety limit — post-meal (mg/dL)?",
    hint: 'Ask your doctor, e.g. 140. Leave blank if not given.', placeholder: 'e.g. 140' },
];

// Visible questions given current answers (conditional safety-limit steps).
export function visiblePregnancyQuestions(answers) {
  return PREGNANCY_QUESTIONS.filter((q) => (q.showIf ? q.showIf(answers) : true));
}

// Map flow answers -> Pregnancy table payload (api.py / db/schema.sql).
export function toPregnancyPayload(answers) {
  const num = (v) => (v === '' || v == null ? null : Number(v));
  return {
    current_week: num(answers.current_week),
    next_visit_date: answers.next_visit_date || null,
    has_high_bp: answers.has_high_bp ? answers.has_high_bp === 'yes' : null,
    has_gestational_diabetes: answers.has_gestational_diabetes ? answers.has_gestational_diabetes === 'yes' : null,
    bp_limit_systolic: num(answers.bp_limit_systolic),
    bp_limit_diastolic: num(answers.bp_limit_diastolic),
    sugar_limit_fasting: num(answers.sugar_limit_fasting),
    sugar_limit_post_meal: num(answers.sugar_limit_post_meal),
  };
}
