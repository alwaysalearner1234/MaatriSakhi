// Child Health Card birth-details — rendered ONE at a time
// by ChildSetupFlow (same UX pattern as PregnancySetupFlow / ChatInterface).
export const CHILD_QUESTIONS = [
  { id: 'name', kind: 'text', required: true,
    title: "What is your baby's name?",
    hint: 'A nickname is fine — you can change it later.', placeholder: 'e.g. Aarav' },
  { id: 'birth_date', kind: 'date', required: true,
    title: "When was your baby born?",
    hint: 'Pick the birth date from the discharge summary.' },
  { id: 'gender', kind: 'choice', required: true, options: ['female', 'male', 'other'],
    title: "What is your baby's gender?",
    hint: 'Used only for growth-chart reference.' },
  { id: 'birth_weight_kg', kind: 'number', required: true, min: 0.3, max: 8, step: '0.01',
    title: "What was the birth weight (kg)?",
    hint: 'From the hospital record, e.g. 2.85.', placeholder: 'e.g. 2.85' },
  { id: 'birth_length_cm', kind: 'number', required: false, min: 20, max: 65, step: '0.1',
    title: 'Birth length in cm? (optional)',
    hint: 'Skip if not recorded.', placeholder: 'e.g. 48' },
  { id: 'delivery_type', kind: 'choice', required: false, options: ['vaginal', 'c-section', 'assisted'],
    title: 'How was the baby delivered? (optional)',
    hint: 'Helps interpret early growth and recovery.' },
  { id: 'current_weight_kg', kind: 'number', required: false, min: 0.5, max: 60, step: '0.01',
    title: "Baby's current weight in kg? (optional)",
    hint: 'For the growth tracker baseline.', placeholder: 'e.g. 3.4' },
  { id: 'current_height_cm', kind: 'number', required: false, min: 20, max: 150, step: '0.1',
    title: "Baby's current length/height in cm? (optional)",
    hint: 'For the growth tracker baseline.', placeholder: 'e.g. 52' },
];

export function toChildPayload(answers, pregnancy_id) {
  const num = (v) => (v === '' || v == null ? null : Number(v));
  return {
    pregnancy_id,
    name: answers.name?.trim() || 'Baby',
    birth_date: answers.birth_date || null,
    gender: answers.gender || null,
    birth_weight_kg: num(answers.birth_weight_kg),
    birth_length_cm: num(answers.birth_length_cm),
    delivery_type: answers.delivery_type || null,
    current_weight_kg: num(answers.current_weight_kg),
    current_height_cm: num(answers.current_height_cm),
  };
}
