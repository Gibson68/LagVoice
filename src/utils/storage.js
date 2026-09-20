/**
 * storage.js — the single owner of browser persistence.
 *
 * Every read is defensive: a value that was hand-edited, half-written, or
 * written by an older version of the app (bad JSON, wrong shape) falls back to
 * the supplied default and is repaired in place, instead of throwing and
 * taking a whole page down with it.
 */

export const STORAGE_KEYS = {
  user: 'lagvoice_user',
  token: 'lagvoice_token',
  accounts: 'lagvoice_accounts',
  complaints: 'lagvoice_complaints',
  prefs: 'lagvoice_notification_prefs',
  theme: 'lagvoice_dark',
}

/** Parse a stored JSON value, repairing the key if it is unreadable. */
export function readJSON(key, fallback) {
  let raw
  try {
    raw = localStorage.getItem(key)
  } catch {
    return fallback
  }
  if (raw === null || raw === '') return fallback
  try {
    const parsed = JSON.parse(raw)
    return parsed === null || parsed === undefined ? fallback : parsed
  } catch {
    // Corrupt value: drop it so the next write starts from a clean slate.
    removeKey(key)
    return fallback
  }
}

/** Read a stored array, tolerating any other JSON shape. */
export function readArray(key) {
  const value = readJSON(key, [])
  return Array.isArray(value) ? value : []
}

/** Read a stored plain object, tolerating arrays and primitives. */
export function readObject(key) {
  const value = readJSON(key, {})
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/** Read a plain string value. */
export function readRaw(key, fallback = '') {
  try {
    const value = localStorage.getItem(key)
    return value === null ? fallback : value
  } catch {
    return fallback
  }
}

export function writeRaw(key, value) {
  try {
    localStorage.setItem(key, String(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* storage unavailable (private mode) — nothing to clean up */
  }
}
