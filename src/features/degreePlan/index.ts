import { createSlice } from '@reduxjs/toolkit'
import importSave from '../importSave'
import reset from '../reset'
import { DegreePlanState } from './model'
import setupDegreePlan from './setupDegreePlan'

const initialState: DegreePlanState = {
    major: '',
    track: '',
    requirements: {},
    loaded: false,
}

const degreePlanSlice = createSlice({
    name: 'degreePlan',
    initialState,
    reducers: {},
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
