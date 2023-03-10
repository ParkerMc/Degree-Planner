import { Save } from '@mui/icons-material'
import { Box, Fab } from '@mui/material'
import { useAppSelector } from '../app/hooks'
import { SaveData } from '../features/saveData'

export default function SaveStudentButton() {
    const saveData: SaveData = useAppSelector((state) => ({
        student: state.student.student,
    }))

    const downloadJson = () => {
        const json = JSON.stringify(saveData)
        const element = document.createElement('a')
        const file = new Blob([json], { type: 'application/json' })
        element.href = URL.createObjectURL(file)
        element.download = `${saveData.student.name}-${saveData.student.id}-DegreePlan.json`
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
