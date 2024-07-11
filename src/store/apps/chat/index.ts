// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const appChatSlice = createSlice({
    name: 'appChat',
    initialState: {
        chats: null,
        contacts: null,
        userProfile: null,
        selectedChat: null
    },
    reducers: {
        removeSelectedChat: state => {
        state.selectedChat = null
        }
    },
    extraReducers: builder => {

    }
})

export const { removeSelectedChat } = appChatSlice.actions

export default appChatSlice.reducer
