import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../services/authService'
import { getProfile, hasSession } from '../services/userService'
import { readRaw, STORAGE_KEYS } from '../utils/storage'

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, role, staffCategory }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password, role, staffCategory)
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData)
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed')
    }
  }
)

const emptyState = {
  user: null,
  token: null,
  isAuthenticated: false,
  role: null,
  loading: false,
  error: null,
  registrationStep: 1,
}

/** Rehydrate a session from the last visit so a refresh keeps you signed in. */
function restoreState() {
  try {
    if (!hasSession()) return emptyState
    const user = getProfile()
    if (!user?.email) return emptyState
    return {
      ...emptyState,
      user,
      token: readRaw(STORAGE_KEYS.token),
      role: user.role,
      isAuthenticated: true,
    }
  } catch {
    return emptyState
  }
}

const initialState = restoreState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.role = null
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
    setRegistrationStep(state, action) {
      state.registrationStep = action.payload
    },
    restoreSession(state, action) {
      const { user, token, role } = action.payload
      state.user = user
      state.token = token
      state.role = role
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.role = action.payload.user.role
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.registrationStep = 1
        // Registering signs you in: the account record is already persisted.
        state.user = action.payload.user
        state.token = action.payload.token
        state.role = action.payload.user?.role || null
        state.isAuthenticated = Boolean(action.payload.token)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError, setRegistrationStep, restoreSession } = authSlice.actions
export default authSlice.reducer
