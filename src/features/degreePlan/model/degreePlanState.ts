import { Class } from '../../student/model'
import { RequirementGroup } from '../../trackRequirements/model'

export interface DegreePlanState {
    major: string
    track: string
    requirements: { [key: string]: RequirementGroup }
    classOverrides: { [key: string]: Class }
    loaded: boolean
}
