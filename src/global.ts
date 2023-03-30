import { TrackRequirements } from './features/trackRequirements/model'

export {}
declare global {
    interface Window {
        degreeRequirements?: {
            load(): Promise<TrackRequirements[]>
        }
    }
}
