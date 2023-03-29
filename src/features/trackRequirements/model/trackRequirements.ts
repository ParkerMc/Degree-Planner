import { RequirementGroup } from './requirementGroup'

export interface TrackRequirements {
    name: string
    major: string
    requirements: { [key: string]: RequirementGroup }
    // TODO add electives and prerequisites
}
