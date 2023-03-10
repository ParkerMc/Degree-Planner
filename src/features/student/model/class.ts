import { SemesterYear } from '.'

export interface Class {
    prefix: string
    course: number
    name: string
    semester: SemesterYear
    grade: string
    attempted: number
    earned: number
    points: number
}
