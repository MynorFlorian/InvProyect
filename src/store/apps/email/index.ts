// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { Dispatch } from 'redux'
import {
  MailType
} from 'src/types/apps/emailTypes'

interface ReduxType {
  getState: any
  dispatch: Dispatch<any>
}

export const appEmailSlice = createSlice({
    name: 'appEmail',
    initialState: {
        mails: null,
        mailMeta: null,
        filter: {
        q: '',
        label: '',
        folder: 'inbox'
        },
        currentMail: null,
        selectedMails: []
    },
    reducers: {
        handleSelectMail: (state, action) => {
        const mails: any = state.selectedMails
        if (!mails.includes(action.payload)) {
            mails.push(action.payload)
        } else {
            mails.splice(mails.indexOf(action.payload), 1)
        }
        state.selectedMails = mails
        },
        handleSelectAllMail: (state, action) => {
        const selectAllMails: number[] = []
        if (action.payload && state.mails !== null) {
            selectAllMails.length = 0

            // @ts-ignore
            state.mails.forEach((mail: MailType) => selectAllMails.push(mail.id))
        } else {
            selectAllMails.length = 0
        }
        state.selectedMails = selectAllMails as any
        }
    },
    extraReducers: builder => {

    }
})

export const { handleSelectMail, handleSelectAllMail } = appEmailSlice.actions

export default appEmailSlice.reducer
