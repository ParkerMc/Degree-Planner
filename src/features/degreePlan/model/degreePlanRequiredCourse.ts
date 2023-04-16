import { RequiredCourse } from '../../trackRequirements/model'

export interface DegreePlanRequiredCourse {
    modified: boolean
    name: string
    prefix: string
    number: number
    default: RequiredCourse
}
