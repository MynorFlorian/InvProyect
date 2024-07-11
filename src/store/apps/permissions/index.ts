// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


interface DataParams {
  q: string
}

export const appPermissionsSlice = createSlice({
    name: 'appPermissions',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {

    }
})

export default appPermissionsSlice.reducer
