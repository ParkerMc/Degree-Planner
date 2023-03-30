import { createSlice } from '@reduxjs/toolkit'
import importSave from '../importSave'
import { DegreePlanState } from './model'
import setupDegreePlan from './setupDegreePlan'

const initialState: DegreePlanState = {
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
            ),
})

export default degreePlanSlice.reducer
