import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as pdfjs from 'pdfjs-dist'
import { TextItem as PdfTextItem } from 'pdfjs-dist/types/src/display/api'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.js',
    import.meta.url
).toString()

// Define a type for the slice state
interface StudentState {
    transcript: TranscriptState
}

interface TranscriptState {
    loading: boolean
    loaded: boolean
}

// Define the initial state using that type
const initialState: StudentState = {
    transcript: { loading: false, loaded: false },
}

export const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // TODO add error case
        builder
            .addCase(importTranscript.pending, (state, action) => {
                // TODO add loading overlay
                state.transcript.loading = true
            })
            .addCase(importTranscript.fulfilled, (state, action) => {
                state.transcript = action.payload
            })
            .addCase(importTranscript.rejected, (state, action) => {
                state.transcript.loading = false
                // TODO setup real error handling
                console.error(action.error)
            })
    },
})

// // Action creators are generated for each case reducer function
// export const { importTranscriptState } = transcriptSlice.actions

export const importTranscript = createAsyncThunk(
    'student/importTranscript',
    async (file: Blob): Promise<TranscriptState> => {
        const pdf = await pdfjs.getDocument(await file.arrayBuffer()).promise
        let pages: string[][][] = []
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textElements = await page.getTextContent({
                disableCombineTextItems: false,
                includeMarkedContent: false,
            })
            const textItems = textElements.items as Array<PdfTextItem>

            // Group into rows
            const pageRows = textItems
                .filter((element) => element.str.trim() !== '')
                .reduce((tmpRows, element) => {
                    const group = tmpRows[element.transform[5]] ?? []
                    group.push(element)
                    tmpRows[element.transform[5]] = group
                    return tmpRows
                }, {} as { [x: number]: PdfTextItem[] })

            // Get the row posses sorted in reverse(y=0 is at the bottom)
            const rowPoses = Object.keys(pageRows)
                .map(Number)
                .sort((a, b) => b - a)
            pages.push(
                rowPoses.map((pos) =>
                    pageRows[pos]
                        .sort((a, b) => a.transform[4] - b.transform[4])
                        .map((element) => element.str)
                )
            )
        }

        // TODO do stuff here
        console.log(pages)

        return {
            loaded: true,
            loading: false,
        }
    }
)
// export const importTranscript = (
//     filePath: string
// ): PayloadAction<TranscriptState, any> => {
//     const reader = new FileReader()
//     return transcriptSlice.actions.importTranscriptState({})
// }
export default studentSlice.reducer
