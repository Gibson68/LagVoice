import api from './api'
import { ROLES } from '../utils/constants'

export const authService = {
  async login(email, password, role) {
    const response = await api.post('/auth/login', { email, password, role })
    
    // The interceptor doesn't return response.data if we don't return response.data in interceptor.
    // Wait, earlier I saw: api.interceptors.response.use((response) => response.data, ... )
    // So response IS already the data payload.
    
    if (response.success) {
      localStorage.setItem('lagvoice_token', response.token)
      localStorage.setItem('lagvoice_user', JSON.stringify(response.user))
    }
    return response
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    if (response.success) {
      localStorage.setItem('lagvoice_token', response.token)
      localStorage.setItem('lagvoice_user', JSON.stringify(response.user))
    }
    return response
  },

  async forgotPassword(email) {
    // We don't have this in the backend yet, simulating for now
    return new Promise(resolve => setTimeout(() => resolve({ success: true, message: 'Password reset link sent to your email.' }), 1000));
  },

  async verifyOTP(email, code) {
    // Simulated for now
    if (code === '123456') {
      return { success: true }
    }
    throw new Error('Invalid OTP code')
  },

  async logout() {
    localStorage.removeItem('lagvoice_token')
    localStorage.removeItem('lagvoice_user')
    return { success: true }
  },

  async updateProfile(userData) {
    const response = await api.put('/auth/me', userData)
    if (response.success) {
      localStorage.setItem('lagvoice_user', JSON.stringify(response.user))
    }
    return response
  },

  getCurrentUser() {
    const token = localStorage.getItem('lagvoice_token')
    const userStr = localStorage.getItem('lagvoice_user')
    if (!token || !userStr) return null
    try {
      return JSON.parse(userStr)
    } catch (e) {
      return null
    }
  },
}
