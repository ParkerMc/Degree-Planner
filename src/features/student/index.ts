import { createSlice } from '@reduxjs/toolkit'
import importSave from '../importSave'
import importTranscript from './importTranscript'
import { StudentState } from './model'

const initialState: StudentState = {
    loading: false,
}

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {},
    extraReducers: (builder) =>
        builder
            .addCase(importTranscript.pending, (state, _action) => {
                state.loading = true
            })
            .addCase(importTranscript.fulfilled, (state, action) => {
                state.transcript = action.payload
                state.loading = false
            })
            .addCase(importTranscript.rejected, (state, _action) => {
                state.loading = false
            })
            .addCase(importSave.pending, (state, _action) => {
                state.loading = true
            })
            .addCase(importSave.fulfilled, (state, action) => {
                state.transcript = action.payload.transcript
                state.additionalInfo = action.payload.additionalInfo
                state.loading = false
            })
            .addCase(importSave.rejected, (state, _action) => {
                state.loading = false
            }),
})

export default studentSlice.reducer
