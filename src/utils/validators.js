/**
 * LagVoice Validators
 * Form validation rules for all input types
 */

/**
 * Validate email address
 * @param {string} email
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateEmail(email) {
  if (!email) return { valid: false, error: 'Email is required' }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(email)) return { valid: false, error: 'Please enter a valid email address' }
  return { valid: true }
}

/**
 * Validate student/staff ID format
 * @param {string} id
 * @param {string} role
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateId(id, role = 'student') {
  if (!id) return { valid: false, error: `${role === 'student' ? 'Student' : 'Staff'} ID is required` }
  const cleaned = id.trim()
  if (cleaned.length < 3) return { valid: false, error: 'ID must be at least 3 characters' }
  return { valid: true }
}

/**
 * Validate password strength
 * @param {string} password
 * @returns {{ valid: boolean, error?: string, strength?: string }}
 */
export function validatePassword(password) {
  if (!password) return { valid: false, error: 'Password is required' }
  if (password.length < 8) return { valid: false, error: 'Password must be at least 8 characters' }

  let strength = 'weak'
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecial].filter(Boolean).length
  if (score >= 4) strength = 'strong'
  else if (score >= 3) strength = 'medium'

  return { valid: true, strength }
}

/**
 * Validate password confirmation matches
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePasswordConfirm(password, confirmPassword) {
  if (!confirmPassword) return { valid: false, error: 'Please confirm your password' }
  if (password !== confirmPassword) return { valid: false, error: 'Passwords do not match' }
  return { valid: true }
}

/**
 * Validate required field
 * @param {string} value
 * @param {string} fieldName
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateRequired(value, fieldName = 'This field') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, error: `${fieldName} is required` }
  }
  return { valid: true }
}

/**
 * Validate feedback description length
 * @param {string} description
 * @param {number} maxLength
 * @returns {{ valid: boolean, error?: string, remaining?: number }}
 */
export function validateDescription(description, maxLength = 500) {
  if (!description) return { valid: false, error: 'Description is required', remaining: maxLength }
  if (description.length > maxLength) {
    return { valid: false, error: `Description must be ${maxLength} characters or less`, remaining: 0 }
  }
  return { valid: true, remaining: maxLength - description.length }
}

/**
 * Validate OTP code
 * @param {string} code
 * @param {number} length
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateOTP(code, length = 6) {
  if (!code) return { valid: false, error: 'OTP code is required' }
  const regex = new RegExp(`^\\d{${length}}$`)
  if (!regex.test(code)) return { valid: false, error: `OTP must be ${length} digits` }
  return { valid: true }
}

/**
 * Validate phone number (Nigerian format)
 * @param {string} phone
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePhone(phone) {
  if (!phone) return { valid: false, error: 'Phone number is required' }
  const cleaned = phone.replace(/[\s\-()]/g, '')
  // Nigerian phone: starts with +234 or 0, followed by 10 digits
  const regex = /^(\+234|0)[789][01]\d{8}$/
  if (!regex.test(cleaned)) return { valid: false, error: 'Please enter a valid Nigerian phone number' }
  return { valid: true }
}
