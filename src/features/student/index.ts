import { createSlice } from '@reduxjs/toolkit'
import importSave from '../importSave'
import importTranscript from './importTranscript'
import { StudentState } from './model'

const initialState: StudentState = {}

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {},
    extraReducers: (builder) =>
        builder
            .addCase(importTranscript.fulfilled, (state, action) => {
                state.transcript = action.payload
            })
            .addCase(importSave.fulfilled, (state, action) => {
                state.transcript = action.payload.transcript
                state.additionalInfo = action.payload.additionalInfo
            }),
})

export default studentSlice.reducer
