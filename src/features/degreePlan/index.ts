import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import importSave from '../importSave'
import reset from '../reset'
import { Class } from '../student/model'
import { DegreePlanState } from './model'
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
export const { updateClassOverride, clearClassOverride } =
    degreePlanSlice.actions
