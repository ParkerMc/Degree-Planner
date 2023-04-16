import { Class, SemesterYear } from '.'

export interface TranscriptData {
    name: string
    id: string
    major: string
    semesterAdmitted: SemesterYear
    classes: { [key: string]: Class }
}
let gpaValues: { [name: string]: number } = {
    'A+': 4.0,
    A: 4,
    'A-': 3.67,
    'B+': 3.33,
    B: 3.0,
    'B-': 2.67,
    'C+': 2.33,
    C: 2.0,
    'C-': 1.67,
    'D+': 1.33,
    D: 1,
    'D-': 0.67,
    F: 0,
}

export function getGPA(transcript: TranscriptData) {
    let weightedHours = 0
    let aggHours = 0
    let classagg = Object.keys(transcript.classes).map(
        (key) => transcript.classes[key]
    )
    classagg.forEach(({ course, grade }) => {
        if (grade !== 'P' && grade !== 'I' && grade !== 'In Progress') {
            weightedHours =
                weightedHours + gpaValues[grade] * +course.toString().charAt(1)
            aggHours = aggHours + +course.toString().charAt(1)
        }
    })
    return weightedHours / aggHours
}
