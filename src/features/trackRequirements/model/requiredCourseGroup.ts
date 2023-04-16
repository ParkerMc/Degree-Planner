import { RequiredCourse } from '.'

export interface RequiredCourseGroup<T> {
    title?: string
    countRequired?: number
    creditHours?: number
    classes: (T | undefined)[]
    suggestedClasses?: (RequiredCourse | undefined)[]
}
