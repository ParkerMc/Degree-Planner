import { Autocomplete, Box, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Semester, SemesterYear } from '../features/student/model'

interface SemesterSelectorProps {
    semester?: SemesterYear
    postfix?: string
    semesterWidth?: number
    yearWidth?: number
    disabled?: boolean
    disableClearable?: boolean
    onChange?: (value?: SemesterYear) => void
}

export default function SemesterSelector(props: SemesterSelectorProps) {
    const [semester, setSemester] = useState(props.semester?.semester)
    const [year, setYear] = useState(props.semester?.year)

    useEffect(() => {
        setSemester(props.semester?.semester)
        setYear(props.semester?.year)
    }, [props.semester])

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
                sx={{ width: props.semesterWidth ?? 150 }}
                title={`Semester${props.postfix ?? ''}`}
                disableClearable={props.disableClearable}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label={`Semester${props.postfix ?? ''}`}
                        />
                    )
                }}
                value={semesters.find((s) => s.label === semester) ?? null}
                onChange={(_, value) => {
                    setSemester(value?.label as Semester | undefined)
                    if (props.onChange) {
                        props.onChange({
                            semester: value?.label as Semester | undefined,
                            year: year,
                        })
                    }
                }}
            />
            <TextField
                disabled={props.disabled}
                sx={{ width: props.yearWidth ?? 90 }}
                label={`Year${props.postfix ?? ''}`}
                type={'number'}
                value={year ?? ''}
                onChange={(e) => {
                    const value =
                        +e.target.value ||
                        (props.disableClearable ? year : undefined)
                    if (
                        props.onChange &&
                        Math.abs(+e.target.value - (year ?? 0)) === 1
                    ) {
                        props.onChange({
                            semester,
                            year: value,
                        })
                    }
                    setYear(value)
                }}
                onBlur={(e) => {
                    e.target.value = (+e.target.value).toString()
                    if (
                        year &&
                        props.semester?.year !== year &&
                        props.onChange
                    ) {
                        props.onChange({
                            semester,
                            year,
                        })
                    }
                }}
            />
        </Box>
    )
}
