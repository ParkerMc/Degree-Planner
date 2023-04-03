import { RequiredCourse, RequiredCourseGroup } from '.'

export interface RequirementGroup {
    name: string
    gpaRequired: number
    groups?: RequiredCourseGroup[]
    classes?: (RequiredCourse | undefined)[]
}
