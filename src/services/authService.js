import { ROLES } from '../utils/constants'
import {
  createAccount,
  deleteAccount,
  endSession,
  findAccount,
  getProfile,
  hasSession,
  saveProfile,
  startSession,
} from './userService'

/**
 * Mock auth service.
 * Account records live in userService, so anything captured at sign-up is the
 * same record the dashboard and profile screens read. Swap in real endpoints
 * when the backend is ready — the shapes stay the same.
 */

// Simulate network delay
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

const seedUsers = [
  {
    name: 'Chidinma Okafor',
    email: 'chidinma@student.unilag.edu.ng',
    studentId: '2021/12345',
    role: ROLES.STUDENT,
    department: 'Computer Science',
    faculty: 'Science',
  },
  {
    name: 'Prof. Adebayo Johnson',
    email: 'adebayo@unilag.edu.ng',
    staffId: 'STAFF/00123',
    role: ROLES.FACULTY,
    department: 'Computer Science',
    faculty: 'Science',
  },
  {
    name: 'Dr. Funke Adeyemi',
    email: 'funke@unilag.edu.ng',
    staffId: 'STAFF/00089',
    role: ROLES.ADMIN,
    department: 'Quality Assurance',
    faculty: 'Administration',
  },
]

/** Turn an email like ada.eze@... into a readable display name. */
function nameFromEmail(email) {
  return String(email || '')
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const authService = {
  /**
   * Sign in. A locally created account always wins, so the name and details a
   * student registered with are the ones they see afterwards.
   */
  async login(email, password, role, staffCategory = '') {
    await delay()
    const account = findAccount(email)
    const seeded = seedUsers.find((u) => u.email === email && u.role === role)
    const fallback = seedUsers.find((u) => u.role === role) || seedUsers[0]

    const profile = account
      ? { ...account, role: account.role || role }
      : {
          ...(seeded || fallback),
          email,
          role,
          staffCategory,
          name: nameFromEmail(email) || (seeded || fallback).name,
        }

    return startSession(profile)
  },

  /** Persist the full sign-up record so the profile screen can complete it. */
  async register(userData = {}) {
    await delay(1200)
    const name = [userData.firstName, userData.lastName].filter(Boolean).join(' ').trim()
    const profile = createAccount({
      name: name || nameFromEmail(userData.email),
      email: userData.email,
      studentId: userData.studentId,
      role: userData.role || ROLES.STUDENT,
      department: userData.department,
      faculty: userData.faculty,
      phone: userData.phone,
    })
    // Sign the new account in straight away so the profile they just filled in
    // is the one they land on.
    const session = startSession(profile)
    return {
      success: true,
      user: session.user,
      token: session.token,
      message: 'Account created. Welcome to LagVoice.',
    }
  },

  async forgotPassword(email) {
    await delay()
    return { success: true, message: 'Password reset link sent to your email.' }
  },

  async verifyOTP(email, code) {
    await delay()
    if (code === '123456') return { success: true }
    throw new Error('Invalid OTP code')
  },

  async logout() {
    endSession()
    return { success: true }
  },

  /** Current signed-in profile, or null when there is no session. */
  getCurrentUser() {
    return hasSession() ? getProfile() : null
  },

  updateProfile(patch) {
    return saveProfile(patch)
  },

  deleteAccount() {
    deleteAccount()
    return { success: true }
  },
}
