import { Autocomplete, Box, TextField } from '@mui/material'
import { useState } from 'react'
import { Semester, SemesterYear } from '../features/student/model'

interface SemesterSelectorProps {
    semester?: SemesterYear
    postfix?: string
    semesterWidth?: number
    yearWidth?: number
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
                options={semesters}
                sx={{ width: props.semesterWidth ?? 100 }}
                title={`Semester${props.postfix}`}
                renderInput={(params) => (
                    <TextField {...params} label={`Semester${props.postfix}`} />
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
                sx={{ width: props.yearWidth ?? 90 }}
                label="Year Admitted"
                type={'number'}
                value={year ?? undefined}
                onChange={(e) => setYear(+e.target.value)}
                onBlur={(e) =>
                    year && props.semester?.year !== year && props.onChange
                        ? props.onChange({
                              semester: semester ?? Semester.Spring,
                              year,
                          })
                        : undefined
                }
            />
        </Box>
    )
}
