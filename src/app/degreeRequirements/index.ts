import fallbackDegreeRequirements from '../../../degreeRequirements'

export function getDegreeRequirements() {
    // TODO write in electron part
    return (window as any).electron ? [] : fallbackDegreeRequirements
}
