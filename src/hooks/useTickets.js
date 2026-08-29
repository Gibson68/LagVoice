import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import {
  fetchTickets,
  fetchTicketById,
  submitTicket,
  addComment,
  setFilters,
  clearFilters,
  clearSelectedTicket,
  clearSubmissionSuccess,
} from '../store/ticketSlice'

/**
 * Custom hook for ticket management
 */
export function useTickets() {
  const dispatch = useDispatch()
  const { tickets, selectedTicket, filters, loading, error, totalTickets, submissionSuccess } =
    useSelector((state) => state.tickets)

  const loadTickets = useCallback(
    (customFilters) => dispatch(fetchTickets(customFilters || filters)),
    [dispatch, filters]
  )

  const loadTicket = useCallback(
    (id) => dispatch(fetchTicketById(id)),
    [dispatch]
  )

  const createTicket = useCallback(
    (data) => dispatch(submitTicket(data)),
    [dispatch]
  )

  const addTicketComment = useCallback(
    (ticketId, comment) => dispatch(addComment({ ticketId, comment })),
    [dispatch]
  )

  const updateFilters = useCallback(
    (newFilters) => dispatch(setFilters(newFilters)),
    [dispatch]
  )

  const resetFilters = useCallback(() => dispatch(clearFilters()), [dispatch])
  const clearTicket = useCallback(() => dispatch(clearSelectedTicket()), [dispatch])
  const clearSuccess = useCallback(() => dispatch(clearSubmissionSuccess()), [dispatch])

  return {
    tickets,
    selectedTicket,
    filters,
    loading,
    error,
    totalTickets,
    submissionSuccess,
    loadTickets,
    loadTicket,
    createTicket,
    addTicketComment,
    updateFilters,
    resetFilters,
    clearTicket,
    clearSuccess,
  }
}
