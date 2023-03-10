import { AdditionalInfo, TranscriptData } from '.'

export interface StudentState {
    loading: boolean
    transcript?: TranscriptData
    additionalInfo?: AdditionalInfo
}
