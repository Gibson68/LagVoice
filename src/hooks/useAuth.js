import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { loginUser, logout, clearError } from '../store/authSlice'
import { authService } from '../services/authService'
import { ROLES } from '../utils/constants'

/**
 * Custom hook for authentication state and actions
 */
export function useAuth() {
  const dispatch = useDispatch()
  const { user, token, isAuthenticated, role, loading, error } = useSelector(
    (state) => state.auth
  )

  const login = useCallback(
    (email, password, role) => dispatch(loginUser({ email, password, role })),
    [dispatch]
  )

  const logoutUser = useCallback(() => {
    authService.logout()
    dispatch(logout())
  }, [dispatch])

  const clearAuthError = useCallback(() => dispatch(clearError()), [dispatch])

  const isStudent = role === ROLES.STUDENT
  const isFaculty = role === ROLES.FACULTY
  const isAdmin = role === ROLES.ADMIN
  const isExternal = role === ROLES.EXTERNAL

  return {
    user,
    token,
    isAuthenticated,
    role,
    loading,
    error,
    login,
    logout: logoutUser,
    clearError: clearAuthError,
    isStudent,
    isFaculty,
    isAdmin,
    isExternal,
  }
}
