import { createAsyncThunk } from '@reduxjs/toolkit'
import { DegreePlanState } from './model'
import { RootState } from '../../app/store'

const setupDegreePlan = createAsyncThunk(
    'degreePlan/setup',
    async (trackName: string, { getState }): Promise<DegreePlanState> => {
        let state = getState() as RootState
        return {
            loaded: true,
        }
    }
)
export default setupDegreePlan
