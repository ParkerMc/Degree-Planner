import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import importSave from '../importSave'
import reset from '../reset'
import { Class } from '../student/model'
import { CourseIdentifier, DegreePlanState } from './model'
import setupDegreePlan from './setupDegreePlan'

const initialState: DegreePlanState = {
    major: '',
    track: '',
    requirements: {},
    classOverrides: {},
    loaded: false,
}

const degreePlanSlice = createSlice({
    name: 'degreePlan',
    initialState,
    reducers: {
        updateClassOverride: (state, action: PayloadAction<Class>) => {
            state.classOverrides[
                `${action.payload.prefix} ${action.payload.course}`
            ] = action.payload
        },
        clearClassOverride: (state, action: PayloadAction<string>) => {
            delete state.classOverrides[action.payload]
        },
        removeCourse: (state, action: PayloadAction<CourseIdentifier>) => {
            const group = state.requirements[action.payload.groupName]
            if (action.payload.group !== undefined) {
                if (!group.groups) {
                    throw new Error('Failed to find course to remove')
                }
                group.groups[action.payload.group].classes = group.groups[
                    action.payload.group
                ].classes.filter(
                    (c) =>
                        c?.number !== action.payload.number ||
                        c?.prefix !== action.payload.prefix
                )
            } else {
                group.classes = group.classes?.filter(
                    (c) =>
                        c?.number !== action.payload.number ||
                        c?.prefix !== action.payload.prefix
                )
            }
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(setupDegreePlan.fulfilled, (_, action) => action.payload)
            .addCase(
                importSave.fulfilled,
                (state, action) => action.payload.degreePlan
            )
            .addCase(reset, () => initialState),
})

export default degreePlanSlice.reducer
export const { clearClassOverride, removeCourse, updateClassOverride } =
    degreePlanSlice.actions
