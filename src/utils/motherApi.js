// MaatriSakhi Mother API client.
// Talks to FastAPI backend (VITE_API_URL) when available,
// otherwise falls back to localStorage so the Render static demo keeps working.
// Tables: Mother -> Pregnancy -> Entry, Visit (see db/schema.sql).

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'maatri_mother_token';
const LOCAL_KEY = 'maatri_mother_local';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}'); }
  catch { return {}; }
}
function saveLocal(patch) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...loadLocal(), ...patch }));
}

async function request(path, { method = 'GET', body } = {}) {
  if (!API_BASE) throw new Error('no-backend');
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.error || `Request failed (${res.status})`);
  return data;
}

// ---- Auth (Mother role) ----
export async function motherSignup({ name, email, password, language = 'en' }) {
  try {
    const data = await request('/mothers/signup', { method: 'POST', body: { name, email, password, language } });
    setToken(data.access_token);
    saveLocal({ mother: data.mother, pregnancies: [], entries: [] });
    return data;
  } catch (e) {
    if (e.message !== 'no-backend') throw e;
    // Offline fallback: simple hashed-by-obscurity demo store (NOT for production)
    const local = loadLocal();
    if (local.mother?.email === email) throw new Error('An account with this email already exists');
    const mother = { id: `local-${Date.now()}`, name, email, language, consent_given: false, consent_at: null };
    saveLocal({ mother, _pw: btoa(password), pregnancies: [], entries: [] });
    return { mother, offline: true };
  }
}

export async function motherLogin({ email, password }) {
  try {
    const data = await request('/mothers/login', { method: 'POST', body: { email, password } });
    setToken(data.access_token);
    saveLocal({ mother: data.mother });
    return data;
  } catch (e) {
    if (e.message !== 'no-backend') throw e;
    const local = loadLocal();
    if (!local.mother || local.mother.email !== email || local._pw !== btoa(password)) {
      throw new Error('Invalid email or password');
    }
    return { mother: local.mother, offline: true };
  }
}

export function motherLogout() {
  setToken(null);
}

// ---- Demo account (mirrors database_init.py seed) ----
// Email: mother@maatri.sakhi   Password: mother123
export const DEMO_MOTHER = { email: 'mother@maatri.sakhi', password: 'mother123', name: 'Demo Mother' };

function demoPregnancyPayload() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return {
    current_week: 38,
    next_visit_date: d.toISOString().slice(0, 10),
    has_high_bp: true,
    has_gestational_diabetes: true,
    bp_limit_systolic: 140,
    bp_limit_diastolic: 90,
    sugar_limit_fasting: 95,
    sugar_limit_post_meal: 140,
  };
}

export async function demoMotherLogin() {
  const { email, password, name } = DEMO_MOTHER;
  try {
    // Online: log in (self-heals by signing up + seeding pregnancy if demo missing)
    let data;
    try {
      data = await request('/mothers/login', { method: 'POST', body: { email, password } });
    } catch (loginErr) {
      data = await request('/mothers/signup', { method: 'POST', body: { name, email, password, language: 'en' } });
      await request('/mothers/consent', { method: 'POST', body: { consent_given: true } }).catch(() => {});
      data.mother = { ...data.mother, consent_given: true };
    }
    setToken(data.access_token);
    saveLocal({ mother: data.mother });
    try {
      let pregs = await request('/pregnancies/my');
      if (!pregs.length) {
        const created = await request('/pregnancies', { method: 'POST', body: demoPregnancyPayload() });
        pregs = [created];
      }
      saveLocal({ pregnancies: pregs, activePregnancy: pregs[0] });
    } catch { /* dashboard loads without pre-cached pregnancy */ }
    return data;
  } catch (e) {
    if (e.message !== 'no-backend') throw e;
    // Offline: seed the same demo data into localStorage (stable ids, no duplicates)
    const local = loadLocal();
    let mother = local.mother?.email === email
      ? { ...local.mother, consent_given: true, consent_at: local.mother.consent_at || new Date().toISOString() }
      : { id: 'demo-mother-1', name, email, language: 'en', consent_given: true, consent_at: new Date().toISOString() };
    let pregnancies = local.pregnancies || [];
    if (!pregnancies.some((p) => p.id === 'preg-demo-1')) {
      pregnancies = [{ id: 'preg-demo-1', mother_id: mother.id, ...demoPregnancyPayload() }, ...pregnancies];
    }
    saveLocal({ mother, _pw: btoa(password), pregnancies, activePregnancy: pregnancies[0], entries: local.entries || [], children: local.children || [] });
    return { mother, offline: true };
  }
}

export const getLocalMother = () => loadLocal().mother || null;

// ---- Consent: consent_given (bool) + consent_at (timestamp) ----
export async function saveConsent(consentGiven) {
  try {
    return await request('/mothers/consent', { method: 'POST', body: { consent_given: consentGiven } });
  } catch (e) {
    if (e.message !== 'no-backend') throw e;
    const local = loadLocal();
    const mother = {
      ...local.mother,
      consent_given: consentGiven,
      consent_at: consentGiven ? new Date().toISOString() : null,
    };
    saveLocal({ mother });
    return { consent_given: mother.consent_given, consent_at: mother.consent_at, offline: true };
  }
}

// ---- Pregnancy profile ----
export async function createPregnancy(payload) {
  try {
    return await request('/pregnancies', { method: 'POST', body: payload });
  } catch (e) {
    if (e.message !== 'no-backend') throw e;
    const local = loadLocal();
    const row = { id: `preg-${Date.now()}`, mother_id: local.mother?.id, ...payload };
    saveLocal({ pregnancies: [row, ...(local.pregnancies || [])], activePregnancy: row });
    return { ...row, offline: true };
  }
}

export async function myPregnancies() {
  try {
    return await request('/pregnancies/my');
  } catch (e) {
    if (e.message !== 'no-backend') throw e;
    return loadLocal().pregnancies || [];
  }
}

// ---- Entries (tracker data -> Entry table) ----
export async function createEntry({ pregnancy_id, type, value_json, note }) {
  try {
    return await request('/entries', { method: 'POST', body: { pregnancy_id, type, value_json, note } });
  } catch (e) {
    if (e.message !== 'no-backend') throw e;
    const local = loadLocal();
    const row = { id: `entry-${Date.now()}`, pregnancy_id, type, value_json, note, created_at: new Date().toISOString() };
    saveLocal({ entries: [row, ...(local.entries || [])] });
    return { ...row, offline: true };
  }
}

export async function listEntries(pregnancy_id, entry_type) {
  try {
    const q = entry_type ? `?pregnancy_id=${pregnancy_id}&entry_type=${entry_type}` : `?pregnancy_id=${pregnancy_id}`;
    // Backend uses query param name pregnancy_id
    return await request(`/entries${q}`);
  } catch (e) {
    if (e.message !== 'no-backend') throw e;
    const all = loadLocal().entries || [];
    return all.filter((r) => r.pregnancy_id === pregnancy_id && (!entry_type || r.type === entry_type));
  }
}

// ---- Child Health Card (tagged to Mother + specific Pregnancy) ----
export async function createChild(payload) {
  try {
    return await request('/children', { method: 'POST', body: payload });
  } catch (e) {
    if (e.message !== 'no-backend') throw e;
    const local = loadLocal();
    if ((local.children || []).some((c) => c.pregnancy_id === payload.pregnancy_id)) {
      throw new Error('A Child Health Card already exists for this pregnancy');
    }
    const preg = (local.pregnancies || []).find((p) => p.id === payload.pregnancy_id) || local.activePregnancy || {};
    const row = { id: `child-${Date.now()}`, mother_id: local.mother?.id, created_at: new Date().toISOString(), ...payload };
    row.prenatal_environment = {
      pregnancy_id: preg.id || payload.pregnancy_id,
      current_week: preg.current_week ?? null,
      has_high_bp: preg.has_high_bp ?? null,
      has_gestational_diabetes: preg.has_gestational_diabetes ?? null,
      bp_limit_systolic: preg.bp_limit_systolic ?? null,
      bp_limit_diastolic: preg.bp_limit_diastolic ?? null,
      sugar_limit_fasting: preg.sugar_limit_fasting ?? null,
      sugar_limit_post_meal: preg.sugar_limit_post_meal ?? null,
    };
    saveLocal({ children: [row, ...(local.children || [])] });
    return { ...row, offline: true };
  }
}

export async function listChildren(pregnancy_id) {
  try {
    const q = pregnancy_id ? `?pregnancy_id=${pregnancy_id}` : '';
    return await request(`/children${q}`);
  } catch (e) {
    if (e.message !== 'no-backend') throw e;
    const all = loadLocal().children || [];
    return pregnancy_id ? all.filter((c) => c.pregnancy_id === pregnancy_id) : all;
  }
}

export async function updateChild(child_id, payload) {
  try {
    return await request(`/children/${child_id}`, { method: 'PUT', body: payload });
  } catch (e) {
    if (e.message !== 'no-backend') throw e;
    const local = loadLocal();
    const children = (local.children || []).map((c) =>
      c.id === child_id ? { ...c, ...Object.fromEntries(Object.entries(payload).filter(([, v]) => v != null && v !== '')) } : c
    );
    saveLocal({ children });
    return children.find((c) => c.id === child_id);
  }
}

// Birth prompt: full term reached OR mother says baby is born
export function shouldPromptChildCard(pregnancy) {
  if (!pregnancy) return false;
  return (pregnancy.current_week ?? 0) >= 37;
}

// ---- Tracker activation logic (shared by setup flow + dashboard) ----
export function trackerFlags(pregnancy = {}) {
  const bpOn =
    pregnancy.has_high_bp === true ||
    pregnancy.bp_limit_systolic != null ||
    pregnancy.bp_limit_diastolic != null;
  const sugarOn =
    pregnancy.has_gestational_diabetes === true ||
    pregnancy.sugar_limit_fasting != null ||
    pregnancy.sugar_limit_post_meal != null;
  return { bpOn, sugarOn };
}

export function daysUntilVisit(nextVisitDate) {
  if (!nextVisitDate) return null;
  const ms = new Date(nextVisitDate).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}
