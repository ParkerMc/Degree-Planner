import { StudentData } from '.'

export interface StudentState {
    loading: boolean
    loaded: boolean
    transcriptLoaded: boolean
    student: StudentData // TODO make nullable
}
