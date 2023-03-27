import { DegreeRequirements } from './features/degreeRequirements/model'

export {}
declare global {
    interface Window {
        degreeRequirements?: {
            load(): Promise<DegreeRequirements[]>
        }
    }
}
