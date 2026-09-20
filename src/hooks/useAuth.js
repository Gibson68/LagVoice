import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { loginUser, registerUser as registerUserThunk, logout, clearError } from '../store/authSlice'
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
    (email, password, role, staffCategory = '') =>
      dispatch(loginUser({ email, password, role, staffCategory })),
    [dispatch]
  )

  /** Creates the account record, then signs the new user straight in. */
  const registerUser = useCallback(
    (userData) => dispatch(registerUserThunk(userData)),
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

  return {
    user,
    token,
    isAuthenticated,
    role,
    loading,
    error,
    login,
    registerUser,
    logout: logoutUser,
    clearError: clearAuthError,
    isStudent,
    isFaculty,
    isAdmin,
  }
}
