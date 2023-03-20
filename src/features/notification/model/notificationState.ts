import { AlertColor } from '@mui/material'

export interface NotificationState {
    open?: boolean
    type?: AlertColor
    message?: string
    timeout?: number | null
    canClose?: boolean
}
