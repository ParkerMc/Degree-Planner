import { RequiredCourse } from '.'

export interface RequiredCourseGroup {
    title?: string
    countRequired?: number
    creditHours?: number
    classes: (RequiredCourse | undefined | null)[]
    suggestedClasses?: (RequiredCourse | undefined | null)[]
}
