import { Alert, Snackbar, SnackbarCloseReason } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { clearNotification } from '../features/notification'

export default function Notification() {
    const notification = useAppSelector((state) => state.notification)
    const dispatch = useAppDispatch()

    const handleClose = (_: unknown, reason?: SnackbarCloseReason) =>
        reason !== 'clickaway' && dispatch(clearNotification())

    return (
        <Snackbar
            open={notification.open}
            autoHideDuration={notification.timeout}
            onClose={handleClose}
        >
            <Alert
                variant="filled"
                onClose={notification.canClose ? handleClose : undefined}
                severity={notification.type}
            >
                {notification.message}
            </Alert>
        </Snackbar>
    )
}
