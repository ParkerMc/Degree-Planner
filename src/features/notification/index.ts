import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import importSave from '../importSave'
import importTranscript from '../student/importTranscript'
import { NotificationState } from './model'

export const notificationInitialState: NotificationState = {
    open: false,
    type: 'info',
    message: '',
    timeout: 5000,
    canClose: true,
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState: notificationInitialState,
    reducers: {
        addNotification: (
            _state,
            action: PayloadAction<NotificationState>
        ) => ({
            ...notificationInitialState,
            ...action.payload,
            open: true,
        }),
        clearNotification: (state) => ({ ...state, open: false }),
    },
    extraReducers: (builder) =>
        builder
            .addCase(importTranscript.pending, (_state, _action) => ({
                ...notificationInitialState,
                message: 'Importing Transcript',
                open: true,
                timeout: undefined,
                canClose: false,
            }))
            .addCase(importTranscript.fulfilled, (_state, _action) => ({
                ...notificationInitialState,
                type: 'success',
                message: 'Successfully Imported Transcript',
                open: true,
            }))
            .addCase(importTranscript.rejected, (_state, action) => {
                console.error(action.error)
                return {
                    ...notificationInitialState,
                    type: 'error',
                    message: `Failed to Import Transcript: ${action.error.message}`,
                    open: true,
                    timeout: undefined,
                }
            })
            .addCase(importSave.pending, (_state, _action) => ({
                ...notificationInitialState,
                message: 'Loading Student',
                open: true,
                timeout: undefined,
                canClose: false,
            }))
            .addCase(importSave.fulfilled, (_state, _action) => ({
                ...notificationInitialState,
                type: 'success',
                message: 'Successfully Loaded Student',
                open: true,
            }))
            .addCase(importSave.rejected, (_state, action) => {
                console.error(action.error)
                return {
                    ...notificationInitialState,
                    type: 'error',
                    message: `Failed to Load Student: ${action.error.message}`,
                    open: true,
                    timeout: undefined,
                }
            }),
})

export default notificationSlice.reducer
export const { addNotification, clearNotification } = notificationSlice.actions
