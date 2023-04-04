import { createAsyncThunk } from '@reduxjs/toolkit'
import { DegreePlanState } from './model'
import { RootState } from '../../app/store'

const setupDegreePlan = createAsyncThunk(
    'degreePlan/setup',
    async (trackName: string, { getState }): Promise<DegreePlanState> => {
        let state = getState() as RootState
        let trackRequirements =
            state.trackRequirements[state.student.additionalInfo.track]

        return {
            major: trackRequirements.major,
            track: trackRequirements.name,
            requirements: trackRequirements.requirements,
            classOverrides: {},
            loaded: true,
        }
    }
)
export default setupDegreePlan
