import { RequirementGroup } from '../../trackRequirements/model'

export interface DegreePlanState {
    major: string
    track: string
    requirements: { [key: string]: RequirementGroup }
    loaded: boolean
}
