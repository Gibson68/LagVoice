import { ROLES } from '../utils/constants'

/**
 * Mock auth service
 * Replace API calls with real endpoints when backend is ready
 */

// Simulate network delay
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

const mockUsers = [
  {
    id: 1,
    name: 'Chidinma Okafor',
    email: 'chidinma@student.unilag.edu.ng',
    studentId: '2021/12345',
    role: ROLES.STUDENT,
    department: 'Computer Science',
    faculty: 'Science',
    avatar: null,
  },
  {
    id: 2,
    name: 'Prof. Adebayo Johnson',
    email: 'adebayo@unilag.edu.ng',
    staffId: 'STAFF/00123',
    role: ROLES.FACULTY,
    department: 'Computer Science',
    faculty: 'Science',
    avatar: null,
  },
  {
    id: 3,
    name: 'Dr. Funke Adeyemi',
    email: 'funke@unilag.edu.ng',
    staffId: 'STAFF/00089',
    role: ROLES.ADMIN,
    department: 'Quality Assurance',
    faculty: 'Administration',
    avatar: null,
  },
]

export const authService = {
  async login(email, password, role) {
    await delay()
    // Mock: accept any valid-looking credentials
    const baseUser = mockUsers.find((u) => u.email === email && u.role === role) || {
      ...mockUsers.find((u) => u.role === role) || mockUsers[0],
      email,
    }
    // Derive a display name from the email prefix if it doesn't match a known user
    const emailPrefix = email.split('@')[0]
    const displayName = emailPrefix
      .split(/[._-]/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    const user = {
      ...baseUser,
      name: displayName || baseUser.name,
      email,
    }
    const token = `mock_token_${Date.now()}`
    localStorage.setItem('lagvoice_token', token)
    localStorage.setItem('lagvoice_user', JSON.stringify(user))
    return { user, token }
  },

  async register(userData) {
    await delay(1200)
    return { success: true, message: 'Registration successful. Please verify your email.' }
  },

  async forgotPassword(email) {
    await delay()
    return { success: true, message: 'Password reset link sent to your email.' }
  },

  async verifyOTP(email, code) {
    await delay()
    if (code === '123456') {
      return { success: true }
    }
    throw new Error('Invalid OTP code')
  },

  async logout() {
    localStorage.removeItem('lagvoice_token')
    return { success: true }
  },

  getCurrentUser() {
    const token = localStorage.getItem('lagvoice_token')
    if (!token) return null
    // In a real app, decode the JWT to get user info
    return mockUsers[0]
  },
}
