import { Autocomplete, Box, TextField } from '@mui/material'
import { useState } from 'react'
import { Semester, SemesterYear } from '../features/student/model'

interface SemesterSelectorProps {
    semester?: SemesterYear
    postfix?: string
    semesterWidth?: number
    yearWidth?: number
    disabled?: boolean
    disableClearable?: boolean // TODO implement
    onChange?: (value?: SemesterYear) => void
}

export default function SemesterSelector(props: SemesterSelectorProps) {
    const [semester, setSemester] = useState(props.semester?.semester)
    const [year, setYear] = useState(props.semester?.year)

    const semesters = Object.values(Semester)
        .filter((s) => s !== 'N/A')
        .map((s) => ({
            label: s,
        }))

    return (
        <Box sx={{ display: 'flex', gap: '10px' }}>
            <Autocomplete
                disabled={props.disabled}
                options={semesters}
                sx={{ width: props.semesterWidth ?? 120 }}
                title={`Semester${props.postfix ?? ''}`}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={`Semester${props.postfix ?? ''}`}
                    />
                )}
                disableClearable={true}
                value={semesters.find((s) => s.label === semester) ?? undefined}
                onChange={(_, value) => {
                    setSemester(value.label as Semester)
                    if (props.onChange) {
                        props.onChange({
                            semester: value.label as Semester,
                            year: year ?? new Date().getFullYear(),
                        })
                    }
                }}
            />
            <TextField
                disabled={props.disabled}
                sx={{ width: props.yearWidth ?? 90 }}
                label={`Year${props.postfix ?? ''}`}
                type={'number'}
                value={year ?? undefined}
                onChange={(e) => setYear(+e.target.value)}
                // TODO on blur is not triggered when using the arrows without selecting first
                onBlur={(e) =>
                    year && props.semester?.year !== year && props.onChange
                        ? props.onChange({
                              semester: semester ?? Semester.Fall,
                              year,
                          })
                        : undefined
                }
            />
        </Box>
    )
}
