import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ticketService } from '../services/ticketService'

// Async thunks
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (filters, { rejectWithValue }) => {
    try {
      return await ticketService.getTickets(filters)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchTicketById = createAsyncThunk(
  'tickets/fetchTicketById',
  async (ticketId, { rejectWithValue }) => {
    try {
      return await ticketService.getTicketById(ticketId)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const submitTicket = createAsyncThunk(
  'tickets/submitTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      return await ticketService.createTicket(ticketData)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addComment = createAsyncThunk(
  'tickets/addComment',
  async ({ ticketId, comment }, { rejectWithValue }) => {
    try {
      return await ticketService.addComment(ticketId, comment)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  tickets: [],
  selectedTicket: null,
  filters: {
    status: 'all',
    category: 'all',
    dateRange: 'all',
    search: '',
  },
  loading: false,
  error: null,
  totalTickets: 0,
  submissionSuccess: null,
}

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters(state) {
      state.filters = initialState.filters
    },
    clearSelectedTicket(state) {
      state.selectedTicket = null
    },
    clearSubmissionSuccess(state) {
      state.submissionSuccess = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tickets
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false
        state.tickets = action.payload.tickets
        state.totalTickets = action.payload.total
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch single ticket
      .addCase(fetchTicketById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedTicket = action.payload
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Submit ticket
      .addCase(submitTicket.pending, (state) => {
        state.loading = true
        state.submissionSuccess = null
      })
      .addCase(submitTicket.fulfilled, (state, action) => {
        state.loading = false
        state.submissionSuccess = action.payload
        state.tickets.unshift(action.payload.ticket)
      })
      .addCase(submitTicket.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.selectedTicket) {
          state.selectedTicket.comments.push(action.payload)
        }
      })
  },
})

export const { setFilters, clearFilters, clearSelectedTicket, clearSubmissionSuccess } = ticketSlice.actions
export default ticketSlice.reducer
