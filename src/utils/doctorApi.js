// Doctor auth client (mirrors motherApi.js conventions).
// Talks to FastAPI (/api/auth/*) when reachable, otherwise falls back to a
// local offline mode so the demo doctor account works WITHOUT a backend.
// Demo doctor: doctor@maatri.sakhi / doctor123 (seeded by database_init.py).
import { getLocalSharedReadings as _getLocalSharedReadings } from './motherApi';

export const DOCTOR_API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const DEMO_DOCTOR = {
  email: 'doctor@maatri.sakhi',
  password: 'doctor123',
  name: 'Demo Doctor',
};

const TOKEN_KEY = 'doctor_token';
const PROFILE_KEY = 'maatri_doctor_local';

export const getDoctorToken = () => localStorage.getItem(TOKEN_KEY);
export const isLocalDoctorToken = (t) => typeof t === 'string' && t.startsWith('local-demo-');

function saveLocalDoctor(doctor) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...doctor, offline: true }));
}
export function getLocalDoctor() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null'); }
  catch { return null; }
}
function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

// Offline success path: demo (or previously signed-up local) doctor, no backend needed.
function offlineDoctorLogin(email, password) {
  const local = getLocalDoctor();
  if (email === DEMO_DOCTOR.email && password === DEMO_DOCTOR.password) {
    const doctor = { name: DEMO_DOCTOR.name, email: DEMO_DOCTOR.email };
    setToken(`local-demo-${Date.now()}`);
    saveLocalDoctor(doctor);
    return { doctor, offline: true };
  }
  if (local && local.email === email && local._pw === btoa(password)) {
    const { _pw, ...doctor } = local;
    setToken(`local-demo-${Date.now()}`);
    return { doctor, offline: true };
  }
  throw new Error('Incorrect email or password.');
}

export async function doctorLogin({ email, password }) {
  try {
    const res = await fetch(`${DOCTOR_API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401) throw new Error('Incorrect email or password.');
      throw new Error(typeof data.detail === 'string' ? data.detail : `Login failed (error ${res.status}).`);
    }
    setToken(data.access_token);
    saveLocalDoctor(data.doctor || { email });
    return { doctor: data.doctor, access_token: data.access_token };
  } catch (err) {
    // Backend unreachable -> offline demo fallback (TypeError = network failure).
    if (err instanceof TypeError) return offlineDoctorLogin(email, password);
    throw err;
  }
}

export async function doctorSignup({ name, email, password }) {
  try {
    const res = await fetch(`${DOCTOR_API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 409) throw new Error('An account with this email already exists.');
      throw new Error(typeof data.detail === 'string' ? data.detail : `Sign-up failed (error ${res.status}).`);
    }
    const doctor = { ...(data.doctor || { email }), ...(name ? { name } : {}) };
    setToken(data.access_token);
    saveLocalDoctor(doctor);
    return { doctor, access_token: data.access_token };
  } catch (err) {
    if (err instanceof TypeError) {
      // Offline: create a local-only doctor account on this device.
      const existing = getLocalDoctor();
      if (existing && existing.email === email) throw new Error('An account with this email already exists on this device.');
      const doctor = { name: name || email.split('@')[0], email };
      setToken(`local-demo-${Date.now()}`);
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...doctor, _pw: btoa(password), offline: true }));
      return { doctor, offline: true };
    }
    throw err;
  }
}

export async function validateDoctorToken() {
  const token = getDoctorToken();
  if (!token) return null;
  if (isLocalDoctorToken(token)) return getLocalDoctor();
  try {
    const res = await fetch(`${DOCTOR_API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return await res.json();
  } catch { return null; /* offline: fall through and clear */ }
  setToken(null);
  return null;
}

export function doctorLogout() {
  setToken(null);
}

// Home BP/sugar readings + open questions shared by mothers
// (doctor_access_granted). Online via backend, else the same-browser
// offline demo store.
export async function fetchSharedReadings() {
  const token = getDoctorToken();
  if (token && !isLocalDoctorToken(token)) {
    try {
      const res = await fetch(`${DOCTOR_API_BASE}/readings/shared`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return { ...(await res.json()), offline: false };
    } catch { /* fall through to local store */ }
  }
  return { ..._getLocalSharedReadings(), offline: true };
}
