import { createSlice } from '@reduxjs/toolkit'
import { DegreeRequirements } from './model'

const initialState: { [key: string]: DegreeRequirements } = {}

const degreeRequirementsSlice = createSlice({
    name: 'degreeRequirements',
    initialState,
    reducers: {},
})

export default degreeRequirementsSlice.reducer
