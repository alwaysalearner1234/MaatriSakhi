// Human-readable answer formatter
// Prevents displaying raw internal keys (e.g. 3_to_6m, tested_negative, noo) to patients or doctors.

export const VALUE_DISPLAY_MAP = {
  // Common
  'yes': 'Yes',
  'no': 'No',
  'noo': 'No',
  'not_sure': 'Not Sure',
  'skipped': 'Skipped',
  'unknown': 'Unknown',
  'none': 'None',
  
  // Pregnancy intention & spacing
  'under_3m': 'Within 3 months',
  '3_to_6m': 'In 3 to 6 months (Recommended)',
  '6_to_12m': 'In 6 to 12 months',
  'undecided': 'Not yet decided',
  'less_6m': 'Less than 6 months',
  '6_to_18m': 'Between 6 and 18 months',
  'more_18m': 'More than 18 months',
  'yes_recent': 'Yes, within last 12–24 months',
  'no_older': 'No, more than 2 years ago',

  // Medical conditions
  'less_1y': 'Less than 1 year',
  '1_to_5y': '1 to 5 years',
  'more_5y': 'More than 5 years',
  'diet_lifestyle': 'Diet & lifestyle only',
  'tablets': 'Oral medications (Tablets)',
  'insulin': 'Insulin therapy',
  'both_rx': 'Both tablets and insulin',
  'under_6_5': 'Under 6.5% (Well controlled)',
  'over_6_5': '6.5% or higher (Elevated)',
  'yes_taking': 'Yes, taking regular medication',
  'not_taking': 'Not currently taking medication',
  'normal_under_130_80': 'Normal (< 130/80 mmHg)',
  'borderline_130_139': 'Borderline (130–139 / 80–89 mmHg)',
  'high_over_140_90': 'High (≥ 140/90 mmHg)',

  // Thyroid
  'hypothyroid': 'Hypothyroidism (Underactive)',
  'hyperthyroid': 'Hyperthyroidism (Overactive)',
  'thyroid_euthyroid': 'Normal / Controlled (TSH < 2.5)',
  'thyroid_elevated': 'High TSH / Needs adjustment',

  // Folic acid
  'standard_400_800': 'Standard dose (400–800 μg daily)',
  'high_5mg': 'High dose (5 mg daily)',

  // Infections / Immunization
  'immune_vaccinated': 'Immune / Fully vaccinated',
  'not_immune': 'Non-immune / Not vaccinated',
  'had_disease_or_vaccine': 'History of infection or vaccinated',
  'never_had_or_vaccinated': 'Never had disease & not vaccinated',
  'tested_negative': 'Tested Negative (Non-reactive)',
  'known_positive': 'Known Positive / Under treatment',
  'never_tested': 'Never tested / Due for screening',

  // Environmental
  'pesticides': 'Agricultural pesticides / chemicals',
  'solvents_metals': 'Industrial solvents / paints / heavy metals',
  'radiation': 'Radiation / Medical X-rays',
  'biomass_smoke': 'Indoor biomass / wood / chulha smoke',
  'extreme_heat': 'Extreme heat exposure',

  // Lifestyle
  'neither': 'Neither partner',
  'partner_only': 'Partner only',
  'patient_only': 'Patient only',
  'both': 'Both partners',
  'patient_occasional': 'Patient (occasionally/socially)',
  'low_0_1': '0 to 1 cup daily',
  'moderate_2_3': '2 to 3 cups daily',
  'high_4_plus': '4 or more cups daily (High)',

  // Mental health & psychosocial
  'first_pregnancy': 'First pregnancy (Nulliparous)',
  'yes_experienced': 'Yes, experienced in prior perinatal period',
  'safe_supported': 'Safe and supported at home',
  'experiencing_stress': 'Experiencing relationship stress',
  'prefer_private_doctor': 'Prefer private doctor discussion',

  // Nutrition
  'vegetarian': 'Vegetarian',
  'non_vegetarian': 'Non-vegetarian (includes meat/fish)',
  'vegan': 'Vegan (strictly plant-based)',
  'minimal_none': 'Minimal / None',
  'moderate_1_2d': 'Moderate (1–2 days/week)',
  'regular_30m_5d': 'Regular (≥ 30 mins, 5 days/week)',

  // Obstetric specifics
  'preeclampsia': 'High BP in pregnancy / Pre-eclampsia',
  'gdm': 'Gestational Diabetes (GDM)',
  'preterm': 'Preterm birth (< 37 weeks)',
  'miscarriage': 'Miscarriage',
  'stillbirth': 'Stillbirth',
  'growth_restriction': 'Fetal growth restriction / Low birth weight',
  'early_miscarriage': 'Early miscarriage (< 12 weeks)',
  'late_miscarriage': 'Late miscarriage (12–20 weeks)',
  'dc_done': 'Dilation & Curettage (D&C)',
  'retained_products': 'Retained products of conception',
  'post_abortal_infection': 'Post-abortal infection',
  'threatened_abortion': 'Threatened abortion',
  'pih': 'Pregnancy Induced Hypertension (PIH)',
  'aph': 'Antepartum Hemorrhage (APH)',
  'gestational_diabetes': 'Gestational Diabetes Mellitus',
  'manual_placenta': 'Manual removal of placenta',
  'cerclage': 'Cervical cerclage placed',
  'prolonged_labour': 'Prolonged labour',
  'cesarean': 'Caesarean section delivery',
  'vaginal': 'Normal vaginal delivery',
  'assisted_delivery': 'Assisted vaginal (Forceps/Ventouse)'
};

/**
 * Format any raw answer into a clean, human-readable representation.
 * Handles strings, arrays, booleans, and objects gracefully.
 */
export function formatAnswerValue(val) {
  if (val === null || val === undefined || val === '') {
    return 'Not specified';
  }

  if (typeof val === 'boolean') {
    return val ? 'Yes' : 'No';
  }

  if (Array.isArray(val)) {
    if (val.length === 0) return 'None';
    return val.map(v => formatAnswerValue(v)).join(', ');
  }

  if (typeof val === 'number') {
    return String(val);
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (VALUE_DISPLAY_MAP[trimmed]) {
      return VALUE_DISPLAY_MAP[trimmed];
    }
    // Handle snake_case or slug strings fallback: e.g. "prior_miscarriage" -> "Prior miscarriage"
    if (trimmed.includes('_') && !trimmed.includes(' ')) {
      const words = trimmed.split('_').map((w, idx) => {
        if (idx === 0) return w.charAt(0).toUpperCase() + w.slice(1);
        return w.toLowerCase();
      });
      return words.join(' ');
    }
    return trimmed;
  }

  if (typeof val === 'object') {
    return JSON.stringify(val);
  }

  return String(val);
}
