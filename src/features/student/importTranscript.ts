import { createAsyncThunk } from '@reduxjs/toolkit'
import { Semester, TranscriptData } from './model'
import { TextItem as PdfTextItem } from 'pdfjs-dist/types/src/display/api'

const importTranscript = createAsyncThunk(
    'student/importTranscript',
    async (file: Blob): Promise<TranscriptData> => {
        // We import this here so that it's only loaded during client-side rendering.
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js'
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

        // Example below of what to do when you need to present an error back to the user
        // throw new Error('Not a transcript')

        return {
            name: 'Nick Reisinger',
            id: '2021511791',
            major: 'Computer Science',
            semesterAdmitted: { semester: Semester.Fall, year: 2020 },
            classes: [],
        }
    }
)
export default importTranscript
