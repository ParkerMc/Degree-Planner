import { SemesterYear } from '.'

export interface Class {
    prefix: string
    course: number
    name: string
    semester: SemesterYear
    grade: string
    transfer: boolean
    fastTrack: boolean
}
