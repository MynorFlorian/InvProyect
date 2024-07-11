// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Types
import { CalendarFiltersType, AddEventType, EventType } from 'src/types/apps/calendarTypes'

export const appCalendarSlice = createSlice({
    name: 'appCalendar',
    initialState: {
        events: [],
        selectedEvent: null,
        selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'ETC']
    },
    reducers: {
        handleSelectEvent: (state, action) => {
        state.selectedEvent = action.payload
        },
        handleCalendarsUpdate: (state, action) => {
        const filterIndex = state.selectedCalendars.findIndex(i => i === action.payload)
        if (state.selectedCalendars.includes(action.payload)) {
            state.selectedCalendars.splice(filterIndex, 1)
        } else {
            state.selectedCalendars.push(action.payload)
        }
        if (state.selectedCalendars.length === 0) {
            state.events.length = 0
        }
        },
        handleAllCalendars: (state, action) => {
        const value = action.payload
        if (value === true) {
            state.selectedCalendars = ['Personal', 'Business', 'Family', 'Holiday', 'ETC']
        } else {
            state.selectedCalendars = []
        }
        }
    },
    extraReducers: builder => {

    }
})
export const { handleSelectEvent, handleCalendarsUpdate, handleAllCalendars } = appCalendarSlice.actions

export default appCalendarSlice.reducer
