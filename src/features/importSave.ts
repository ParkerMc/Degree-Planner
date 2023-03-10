import { createAsyncThunk } from '@reduxjs/toolkit'
import { SaveData } from './saveData'

const importSave = createAsyncThunk(
    'student/importSave',
    async (file: Blob): Promise<SaveData> => {
        return JSON.parse(await file.text())
    }
)
export default importSave
