/**
 * userService.js — the single owner of the student account record.
 *
 * The shape written at registration is the same shape the profile screen reads
 * and edits, so nothing has to re-derive a user from a token or an email.
 * Storage access goes through utils/storage, so a corrupt value can never
 * break a page.
 */
import {
  readArray,
  readRaw,
  readJSON,
  removeKey,
  writeJSON,
  writeRaw,
  STORAGE_KEYS,
} from '../utils/storage'
import { ROLES } from '../utils/constants'

export const FACULTIES = [
  'Arts',
  'Basic Medical Sciences',
  'Clinical Sciences',
  'Dental Sciences',
  'Education',
  'Engineering',
  'Environmental Sciences',
  'Law',
  'Management Sciences',
  'Pharmacy',
  'Science',
  'Social Sciences',
  'Administration',
]

export const DEPARTMENTS = [
  'Accounting',
  'Actuarial Science & Insurance',
  'Architecture',
  'Biochemistry',
  'Business Administration',
  'Cell Biology & Genetics',
  'Chemical Engineering',
  'Chemistry',
  'Civil Engineering',
  'Computer Science',
  'Economics',
  'Electrical & Electronics Engineering',
  'English',
  'Finance',
  'Geology',
  'History & Strategic Studies',
  'Mass Communication',
  'Mathematics',
  'Mechanical Engineering',
  'Medicine & Surgery',
  'Microbiology',
  'Pharmacy',
  'Philosophy',
  'Physics',
  'Political Science',
  'Psychology',
  'Sociology',
  'Zoology',
  'Quality Assurance',
]

export const LEVELS = ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level', '600 Level']

export const PROGRAMMES = ['B.Sc.', 'B.A.', 'B.Eng.', 'LL.B.', 'B.Pharm.', 'MBBS', 'M.Sc.', 'Ph.D.']

export const SESSIONS = ['2023/2024', '2024/2025', '2025/2026', '2026/2027']

export const GENDERS = ['Female', 'Male', 'Prefer not to say']

/** Sign-up categories for staff accounts (rides along on the profile). */
export const STAFF_CATEGORIES = [
  { id: 'staff', label: 'Staff' },
  { id: 'non-staff', label: 'Non-Staff' },
]

/** The human label for a profile's role/category combination. */
export function roleLabel(profile) {
  const role = String(profile?.role || '').toLowerCase()
  if (role === ROLES.ADMIN) return 'Administrator'
  if (role === ROLES.STUDENT) return 'Student'
  const category = String(profile?.staffCategory || '').toLowerCase()
  if (category === 'non-staff') return 'Non-Staff'
  if (category === 'staff') return 'Staff'
  return 'Faculty'
}

const text = (value, fallback = '') =>
  typeof value === 'string' ? value.trim() : value === 0 ? '0' : fallback

/** Coerce anything read from storage into a complete, safe profile object. */
export function normaliseProfile(raw) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  const fullName = text(source.name) || [text(source.firstName), text(source.lastName)].filter(Boolean).join(' ')
  return {
    id: text(source.id) || `LG-${Date.now().toString(36).toUpperCase()}`,
    name: fullName || 'Unilag Student',
    email: text(source.email),
    phone: text(source.phone),
    studentId: text(source.studentId) || text(source.staffId),
    role: text(source.role) || ROLES.STUDENT,
    staffCategory: text(source.staffCategory),
    faculty: text(source.faculty) || 'Science',
    department: text(source.department) || 'Computer Science',
    programme: text(source.programme) || 'B.Sc.',
    level: text(source.level) || '300 Level',
    session: text(source.session) || '2025/2026',
    gender: text(source.gender),
    dateOfBirth: text(source.dateOfBirth),
    address: text(source.address),
    stateOfOrigin: text(source.stateOfOrigin),
    guardianName: text(source.guardianName),
    guardianPhone: text(source.guardianPhone),
    bio: text(source.bio),
    joinedAt: text(source.joinedAt) || new Date().toISOString(),
    passwordUpdatedAt: text(source.passwordUpdatedAt),
    avatar: source.avatar ?? null,
  }
}

/** The profile of the signed-in user. */
export function getProfile() {
  return normaliseProfile(readJSON(STORAGE_KEYS.user, {}))
}

/** Merge a partial edit into the stored profile and return the full record. */
export function saveProfile(patch) {
  const next = normaliseProfile({ ...getProfile(), ...(patch || {}) })
  writeJSON(STORAGE_KEYS.user, next)
  return next
}

/** Every account created on this device. */
export function getAccounts() {
  const accounts = readArray(STORAGE_KEYS.accounts)
  return accounts.filter((a) => a && typeof a === 'object').map(normaliseProfile)
}

function persistAccounts(accounts) {
  writeJSON(STORAGE_KEYS.accounts, accounts.map(normaliseProfile))
}

/**
 * Create (or refresh) the account record for an email and persist it.
 * Returns the stored profile.
 */
export function createAccount(data) {
  const profile = normaliseProfile({ ...data, joinedAt: new Date().toISOString() })
  const accounts = getAccounts().filter((a) => a.email.toLowerCase() !== profile.email.toLowerCase())
  persistAccounts([profile, ...accounts.slice(0, 19)])
  writeJSON(STORAGE_KEYS.user, profile)
  return profile
}

/** Look up a previously created account by email. */
export function findAccount(email) {
  const target = String(email || '').trim().toLowerCase()
  if (!target) return null
  return getAccounts().find((a) => a.email.toLowerCase() === target) || null
}

/** Sign a profile in: store it as the current user and mint a mock token. */
export function startSession(profile) {
  const stored = saveProfile(profile)
  writeRaw(STORAGE_KEYS.token, `mock_token_${Date.now()}`)
  return { user: stored, token: readRaw(STORAGE_KEYS.token) }
}

/** Whether a previous session exists on this device. */
export function hasSession() {
  return Boolean(readRaw(STORAGE_KEYS.token, ''))
}

/** Drop the session but keep the account and profile edits. */
export function endSession() {
  removeKey(STORAGE_KEYS.token)
}

/**
 * Bring stored data into the current shape at boot.
 *
 * Older builds wrote a `lagvoice_auth` blob that nothing reads any more, and a
 * record written by an earlier version can be missing fields the app now
 * expects. Both are repaired here so a stale value can never break a page.
 */
export function migrateLegacyAccounts() {
  if (readRaw('lagvoice_auth', '')) removeKey('lagvoice_auth')

  const stored = readJSON(STORAGE_KEYS.user, null)
  if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
    writeJSON(STORAGE_KEYS.user, normaliseProfile(stored))
  }

  const accounts = readArray(STORAGE_KEYS.accounts)
  if (accounts.length) persistAccounts(accounts)
}

/** Delete the account: profile, stored account list, session and prefs. */
export function deleteAccount() {
  const { email } = getProfile()
  persistAccounts(getAccounts().filter((a) => a.email.toLowerCase() !== String(email).toLowerCase()))
  removeKey(STORAGE_KEYS.user)
  removeKey(STORAGE_KEYS.token)
  removeKey(STORAGE_KEYS.prefs)
}
