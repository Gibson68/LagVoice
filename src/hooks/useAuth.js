import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { loginUser, registerUser, logout, clearError, updateUser } from '../store/authSlice'
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

  const register = useCallback(
    async (userData) => {
      const resultAction = await dispatch(registerUser({ ...userData, name: `${userData.firstName} ${userData.lastName}` }))
      if (registerUser.rejected.match(resultAction)) {
        throw new Error(resultAction.payload)
      }
      return resultAction.payload
    },
    [dispatch]
  )

  const updateProfile = useCallback(
    async (userData) => {
      const response = await authService.updateProfile(userData)
      if (response.success) {
        dispatch(updateUser(response.user))
      }
      return response
    },
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
    registerUser: register,
    updateProfile,
    logout: logoutUser,
    clearError: clearAuthError,
    isStudent,
    isFaculty,
    isAdmin,
    isExternal,
  }
}
