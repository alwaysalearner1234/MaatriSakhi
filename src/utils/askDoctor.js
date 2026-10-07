// Top-3 "questions to ask your doctor" — rule-based suggestions generated from
// the mother's own pregnancy profile + home tracker readings. Shown in the
// Mother dashboard ("Ask your doctor"); tapping one fills the question box.

function latestEntry(entries, type) {
  const rows = (entries || []).filter((e) => e.type === type);
  return rows.length ? rows[0] : null; // lists are newest-first
}

function fmtBp(v) {
  return v ? `${v.systolic ?? '–'}/${v.diastolic ?? '–'}` : null;
}

export function topQuestionsFor(pregnancy = {}, entries = []) {
  const out = [];
  const push = (key, text, reason) => {
    if (out.length < 3 && !out.some((q) => q.key === key)) out.push({ key, text, reason });
  };

  const bp = latestEntry(entries, 'bp');
  const sugar = latestEntry(entries, 'sugar');
  const week = pregnancy.current_week;
  const visit = pregnancy.next_visit_date;

  // 1) Home reading above the doctor's limit — most urgent, always first.
  if (bp?.value_json && (
    (pregnancy.bp_limit_systolic && bp.value_json.systolic > pregnancy.bp_limit_systolic) ||
    (pregnancy.bp_limit_diastolic && bp.value_json.diastolic > pregnancy.bp_limit_diastolic)
  )) {
    push(
      'bp-over',
      `My home BP was ${fmtBp(bp.value_json)}, above my limit of ${pregnancy.bp_limit_systolic ?? '–'}/${pregnancy.bp_limit_diastolic ?? '–'}. Should I come in earlier than planned?`,
      'Based on your latest home BP reading'
    );
  }
  const sugarLim = sugar?.value_json?.kind === 'post_meal'
    ? pregnancy.sugar_limit_post_meal
    : pregnancy.sugar_limit_fasting;
  if (sugar?.value_json && sugarLim && sugar.value_json.mg_dl > sugarLim) {
    push(
      'sugar-over',
      `My home sugar was ${sugar.value_json.mg_dl} mg/dL (${sugar.value_json.kind === 'post_meal' ? 'post-meal' : 'fasting'}), above my limit of ${sugarLim}. Should my diet or medicine change?`,
      'Based on your latest home sugar reading'
    );
  }

  // 2) Visit preparation.
  if (visit) {
    const days = Math.round((new Date(visit).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);
    if (days >= 0 && days <= 7) {
      push(
        'visit-prep',
        `My visit is on ${visit} (in ${days} day${days === 1 ? '' : 's'}). Which home readings and reports should I bring?`,
        'Based on your upcoming visit'
      );
    }
  }

  // 3) Condition-specific routines.
  if (pregnancy.has_high_bp) {
    push(
      'bp-routine',
      'How often should I check my BP at home, and at what reading should I call you immediately?',
      'Because you have high BP'
    );
  }
  if (pregnancy.has_gestational_diabetes) {
    push(
      'sugar-routine',
      'What should my fasting and post-meal sugar targets be at home, and how often should I check?',
      'Because you have gestational diabetes'
    );
  }

  // 4) Stage-specific.
  if (week != null && week >= 28) {
    push(
      'third-tri',
      'Which warning signs — swelling, headache, vision changes, reduced baby movements — should make me rush to the hospital?',
      `Based on week ${week} of pregnancy`
    );
  } else if (week != null && week < 14) {
    push(
      'first-tri',
      'Which first-trimester tests, scans and supplements do I still need?',
      `Based on week ${week} of pregnancy`
    );
  }

  // 5) Generic fillers so there are always 3.
  push(
    'diet',
    'Which foods, and which iron / folic-acid tablets, should I continue until my next visit?',
    'Good for every visit'
  );
  push(
    'rest',
    'How much rest, sleep and daily activity is safe for me right now?',
    'Good for every visit'
  );
  push(
    'danger',
    'Which symptoms should make me contact you immediately instead of waiting for my visit?',
    'Good for every visit'
  );

  return out.slice(0, 3);
}
