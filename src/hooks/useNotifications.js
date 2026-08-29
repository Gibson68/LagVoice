import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { addNotification, markAsRead, markAllAsRead, clearNotifications } from '../store/notificationSlice'

/**
 * Custom hook for notification management
 */
export function useNotifications() {
  const dispatch = useDispatch()
  const { items, unreadCount } = useSelector((state) => state.notifications)

  const add = useCallback(
    (notification) => dispatch(addNotification(notification)),
    [dispatch]
  )

  const read = useCallback(
    (id) => dispatch(markAsRead(id)),
    [dispatch]
  )

  const readAll = useCallback(() => dispatch(markAllAsRead()), [dispatch])

  const clear = useCallback(() => dispatch(clearNotifications()), [dispatch])

  return {
    notifications: items,
    unreadCount,
    addNotification: add,
    markAsRead: read,
    markAllAsRead: readAll,
    clearNotifications: clear,
  }
}
