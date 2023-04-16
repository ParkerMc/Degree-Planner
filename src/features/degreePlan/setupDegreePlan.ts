import { createAsyncThunk } from '@reduxjs/toolkit'
import { DegreePlanState } from './model'
import { RootState } from '../../app/store'
import { RequirementGroup } from '../trackRequirements/model'
import { DegreePlanRequiredCourse } from './model/degreePlanRequiredCourse'

const setupDegreePlan = createAsyncThunk(
    'degreePlan/setup',
    async (trackName: string, { getState }): Promise<DegreePlanState> => {
        let state = getState() as RootState
        let trackRequirements =
            state.trackRequirements[state.student.additionalInfo.track]

        let requirements: {
            [key: string]: RequirementGroup<DegreePlanRequiredCourse>
        } = {}

        Object.keys(trackRequirements.requirements).forEach((key) => {
            const last = trackRequirements.requirements[key]
            requirements[key] = {
                ...last,
                groups: last.groups?.map((g) => ({
                    ...g,
                    classes: g.classes?.map((c) =>
                        c ? { ...c, default: c, modified: false } : undefined
                    ),
                })),
                classes: last.classes?.map((c) =>
                    c ? { ...c, default: c, modified: false } : undefined
                ),
            }
        })

        return {
            major: trackRequirements.major,
            track: trackRequirements.name,
            requirements,
            classOverrides: {},
            loaded: true,
        }
    }
)
export default setupDegreePlan
