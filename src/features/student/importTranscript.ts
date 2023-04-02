import { createAsyncThunk } from '@reduxjs/toolkit'
import { Semester, TranscriptDataResponse } from './model'
import { TextItem as PdfTextItem } from 'pdfjs-dist/types/src/display/api'
import { RootState } from '../../app/store'
import { TranscriptData, SemesterYear, Class } from './model'

const importTranscript = createAsyncThunk(
    'student/importTranscript',
    async (file: Blob, { getState }): Promise<TranscriptDataResponse> => {
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
        console.log(pages)

        const student: TranscriptData = {
            name: '',
            id: '',
            major: '',
            semesterAdmitted: { semester: Semester.None, year: 1 },
            classes: [],
        }
        let allClasses: string[] = ['CS', 'EE', 'ECS', 'ECSC', 'SE', 'MATH']
        let seasons: string[] = ['Fall', 'Spring', 'Summer']
        let currentYearMonth: string[] = []

        for (let j = 0; j < pages.length; j++) {
            for (let k = 0; k < pages[j].length; k++) {
                // get the year and semester and if one isnt set for admission add one
                if (seasons.indexOf(pages[j][k][0].split(' ', 2)[1]) > -1) {
                    currentYearMonth = pages[j][k][0].split(' ', 2)
                    if (student.semesterAdmitted.year == 1) {
                        student.semesterAdmitted.year = +currentYearMonth[0]
                        student.semesterAdmitted.semester =
                            currentYearMonth[1] as Semester
                    }
                }

                // add student name
                if (pages[j][k][0] == 'Name:') {
                    student.name = pages[j][k][1]
                }

                //add id
                if (pages[j][k][1] == 'ID:') {
                    student.id = pages[j][k][2]
                }

                if (pages[j][k].length > 1) {
                    if (pages[j][k][1].includes('Major')) {
                        student.major = pages[j][k][1]
                    }
                }

                // add classes to classes
                if (allClasses.indexOf(pages[j][k][0]) > -1) {
                    console.log(pages[j][k])
                    if (pages[j][k].length > 6) {
                        let tempClass: Class = {
                            prefix: pages[j][k][0],
                            course: +pages[j][k][1],
                            name: pages[j][k][2],
                            semester: {
                                semester: currentYearMonth[1] as Semester,
                                year: +currentYearMonth[0],
                            },
                            grade: pages[j][k][5],
                            attempted: +pages[j][k][3],
                            earned: +pages[j][k][4],
                            points: +pages[j][k][6],
                        }
                        student.classes.push(tempClass)
                    } else {
                        let tempClass: Class = {
                            prefix: pages[j][k][0],
                            course: +pages[j][k][1],
                            name: pages[j][k][2],
                            semester: {
                                semester: currentYearMonth[1] as Semester,
                                year: +currentYearMonth[0],
                            },
                            grade: 'N/A',
                            attempted: +pages[j][k][3],
                            earned: 0,
                            points: 0,
                        }
                        student.classes.push(tempClass)
                    }
                }
            }
        }
        console.log(student)

        // Example below of what to do when you need to present an error back to the user
        // throw new Error('Not a transcript')
        let transcript = {
            name: 'Nick Reisinger',
            id: '2021511791',
            major: 'Computer Science',
            semesterAdmitted: { semester: Semester.Fall, year: 2020 },
            classes: [],
        }

        let requirements = (getState() as RootState).trackRequirements
        let requirementsOptions = Object.keys(requirements)
            .map((key) => requirements[key])
            .filter((r) => r.major === transcript.major)

        return {
            transcript,
            track:
                requirementsOptions.length === 1
                    ? requirementsOptions[0].name
                    : '',
        }
    }
)
export default importTranscript
