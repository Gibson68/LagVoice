import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import ticketReducer from './ticketSlice'
import notificationReducer from './notificationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    notifications: notificationReducer,
  },
})
