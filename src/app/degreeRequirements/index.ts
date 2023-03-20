import fallbackDegreeRequirements from './state'
import { DegreeRequirements } from './model'

let degreeRequirements: DegreeRequirements[] = []
export default degreeRequirements

export function loadDegreeRequirements() {
    if (window.degreeRequirements) {
        window.degreeRequirements.load().then((requirements) => {
            degreeRequirements = requirements
        })
    } else {
        degreeRequirements = fallbackDegreeRequirements
        console.log()
    }
}
