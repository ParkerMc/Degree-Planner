import { Save } from '@mui/icons-material'
import { Box, Fab } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { addNotification } from '../features/notification'
import { SaveData } from '../features/saveData'
import version from '../version'

export default function SaveStudentButton() {
    const { transcript, additionalInfo } = useAppSelector((state) => ({
        transcript: state.student.transcript,
        additionalInfo: state.student.additionalInfo,
    }))
    const dispatch = useAppDispatch()

    const downloadJson = () => {
        if (!transcript || !additionalInfo) {
            dispatch(
                addNotification({
                    type: 'error',
                    message: 'Failed to save partal student',
                    timeout: undefined,
                })
            )
            return
        }
        const saveData: SaveData = { version, transcript, additionalInfo }
        const element = document.createElement('a')
        const file = new Blob([JSON.stringify(saveData)], {
            type: 'application/json',
        })
        element.href = URL.createObjectURL(file)
        element.download = `${transcript.name}-${transcript.id}-DegreePlan.json`
        document.body.appendChild(element) // Required for this to work in FireFox
        element.click()
    }

    return (
        <Box>
            <Fab variant="extended" size="large" onClick={downloadJson}>
                <Save />
                Save
            </Fab>
        </Box>
    )
}
