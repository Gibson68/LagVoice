import { createSlice } from '@reduxjs/toolkit'

const mockNotifications = [
  {
    id: 1,
    title: 'Ticket Updated',
    message: 'Your complaint #UNILAG-00042 has been updated to "Under Review"',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    title: 'New Poll Available',
    message: 'Campus Security survey is now available. Complete it before Friday.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 3,
    title: 'Ticket Resolved',
    message: 'Your complaint #UNILAG-00038 has been resolved. Thank you for your patience!',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: mockNotifications,
    unreadCount: mockNotifications.filter((n) => !n.read).length,
  },
  reducers: {
    addNotification(state, action) {
      state.items.unshift(action.payload)
      state.unreadCount += 1
    },
    markAsRead(state, action) {
      const notification = state.items.find((n) => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllAsRead(state) {
      state.items.forEach((n) => (n.read = true))
      state.unreadCount = 0
    },
    clearNotifications(state) {
      state.items = []
      state.unreadCount = 0
    },
  },
})

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationSlice.actions
export default notificationSlice.reducer
