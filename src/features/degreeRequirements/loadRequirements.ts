import { createAsyncThunk } from '@reduxjs/toolkit'
import { DegreeRequirements } from './model'
import test from 'degree_requirements/test.json'

const loadRequirements = createAsyncThunk(
    'loadRequirements',
    async (): Promise<DegreeRequirements[]> => {
        if (window.degreeRequirements) {
            return await window.degreeRequirements.load()
        }

        return [test]
    }
)
export default loadRequirements
