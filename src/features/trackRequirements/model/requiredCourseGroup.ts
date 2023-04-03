import { RequiredCourse } from '.'

export interface RequiredCourseGroup {
    countRequired: number
    classes: (RequiredCourse | undefined)[]
}
