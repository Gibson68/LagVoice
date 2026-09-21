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


