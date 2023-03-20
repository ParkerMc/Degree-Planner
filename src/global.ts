import { DegreeRequirements } from './app/degreeRequirements/model'

export {}
declare global {
    interface Window {
        degreeRequirements?: {
            load(): Promise<DegreeRequirements[]>
        }
    }
}
