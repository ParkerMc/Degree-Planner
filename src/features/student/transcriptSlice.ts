import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface StudentState {
    transcript?: TranscriptState
}

interface TranscriptState {}

// Define the initial state using that type
const initialState: StudentState = {}

export const transcriptSlice = createSlice({
    name: 'transcript',
    initialState,
    reducers: {
        importTranscriptState: (
            state,
            action: PayloadAction<TranscriptState>
        ) => {
            state = action.payload
        },
    },
})

// // Action creators are generated for each case reducer function
// export const { importTranscriptState } = transcriptSlice.actions

export const importTranscript = (
    filePath: string
): PayloadAction<TranscriptState, any> => {
    const reader = new FileReader()
    return transcriptSlice.actions.importTranscriptState({})
}
export default transcriptSlice.reducer
