import { Fragment } from 'react'
import { Grade } from '../features/student/model/grade'
import SemesterSelector from './SemesterSelector'
import { Autocomplete, TextField } from '@mui/material'

interface GradeSelectorProps {
    disabled?: boolean
    grade?: Grade
    onChange?: (value: Grade) => void
}

const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'F', 'I', 'P'].map(
    (g) => ({
        label: g,
    })
)

export default function GradeSelector(props: GradeSelectorProps) {
    return (
        <Fragment>
            <SemesterSelector
                disabled={props.disabled}
                semester={props.grade?.semester}
                onChange={(value) => {
                    if (!props.onChange) {
                        return
                    }
                    props.onChange({
                        semester: value,
                        grade: props.grade?.grade,
                    })
                }}
            />
            <Autocomplete
                disabled={props.disabled}
                options={grades}
                sx={{ width: 100 }}
                title="Grade"
                freeSolo
                handleHomeEndKeys
                renderInput={(params) => (
                    <TextField
                        {...params}
                        inputProps={{
                            ...params.inputProps,
                            onKeyDown: (e) => {
                                console.log('B')
                                if (e.key === 'Enter') {
                                    console.log('C')
                                }
                            },
                        }}
                        onBlur={(event) => {
                            console.log('A')
                            event.target.dispatchEvent(
                                new KeyboardEvent('keydown', { key: 'Enter' })
                            )
                        }}
                        label="Grade"
                    />
                )}
                value={
                    grades.find((g) => g.label === props.grade?.grade) ?? null
                }
                onChange={(_, value) => {
                    if (!props.onChange) {
                        return
                    }
                    props.onChange({
                        semester: props.grade?.semester,
                        grade:
                            typeof value === 'string'
                                ? value
                                : value?.label ?? undefined,
                    })
                }}
            />
        </Fragment>
    )
}
