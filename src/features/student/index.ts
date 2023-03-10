import { createSlice } from '@reduxjs/toolkit'
import importSave from '../importSave'
import importTranscript from './importTranscript'
import { Semester, StudentState } from './model'

const initialState: StudentState = {
    loading: false,
    loaded: false,
    transcriptLoaded: false,
    student: {
        name: '',
        id: '',
        major: '',
        semesterAdmitted: { semester: Semester.None, year: 0 },
        classes: [],
        track: '',
        fastTrack: false,
        thesis: false,
    },
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
                state.student = { ...state.student, ...action.payload }
                state.loading = false
                state.transcriptLoaded = true
                console.log(state)
            })
            .addCase(importTranscript.rejected, (state, _action) => {
                state.loading = false
            })
            .addCase(importSave.pending, (state, _action) => {
                state.loading = true
            })
            .addCase(importSave.fulfilled, (state, action) => {
                state.student = action.payload.student
                state.loading = false
                state.transcriptLoaded = true
                state.loaded = true
            })
            .addCase(importSave.rejected, (state, _action) => {
                state.loading = false
            }),
})

export default studentSlice.reducer
