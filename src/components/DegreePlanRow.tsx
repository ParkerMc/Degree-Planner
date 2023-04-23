import {
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    TextField,
} from '@mui/material'
import { useState } from 'react'
import { Class } from '../features/student/model'
import { RequiredCourse } from '../features/trackRequirements/model'
import { DegreePlanRequiredCourse } from '../features/degreePlan/model/degreePlanRequiredCourse'
import { Delete, RestartAlt } from '@mui/icons-material'
import GradeSelector from './GradeSelector'

interface DegreePlanRowProps {
    course?: DegreePlanRequiredCourse
    transcriptClass?: Class
    overrideClass?: Class
    onOverrideChange?: (value?: Class) => void
    onCourseChange?: (value?: RequiredCourse) => void
    onRemove?: () => void
}

export default function DegreePlanRow(props: DegreePlanRowProps) {
    const [courseName, setCourseName] = useState(
        props.course?.name === '' ? undefined : props.course?.name
    )

    const pushOverrideChange = (value?: Class) => {
        if (props.onOverrideChange) {
            if (
                props.transcriptClass?.grade.grade === value?.grade.grade &&
                props.transcriptClass?.grade.semester?.semester ===
                    value?.grade.semester?.semester &&
                props.transcriptClass?.grade.semester?.year ===
                    value?.grade.semester?.year &&
                props.transcriptClass?.transfer === value?.transfer &&
                props.transcriptClass?.fastTrack === value?.fastTrack
            ) {
                props.onOverrideChange(undefined)
                return
            }
            props.onOverrideChange(value)
        }
    }

    // TODO support changing transcriptClass
    const courseOptions = []
    if (props.course) {
        courseOptions.push({
            label: `${props.course?.prefix} ${props.course?.number}`,
        })
    }

    const transferOptions = ['Transfer', 'Fast Track'].map((v) => ({
        label: v,
    }))

    const edited = props.overrideClass || props.course?.modified

    return (
        <Box sx={{ display: 'flex', gap: '10px' }}>
            {/* TODO allow freetext */}
            <Autocomplete
                options={courseOptions}
                sx={{ width: 200 }}
                renderInput={(params) => (
                    <TextField {...params} label="Course Number" />
                )}
                value={props.course ? courseOptions[0] : undefined}
                onChange={(_, value) => {
                    if (!props.onCourseChange) {
                        return
                    }

                    // TODO error check value
                    if (!value) {
                        props.onCourseChange(undefined)
                        return
                    }
                    const split = value.label.split(' ')
                    props.onCourseChange({
                        prefix: split[0],
                        number: +split[1],
                        name: '',
                    })
                }}
            />
            <TextField
                sx={{ width: 400 }}
                label="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                onBlur={(e) =>
                    props.onCourseChange &&
                    props.course &&
                    props.course.name !== courseName
                        ? props.onCourseChange({
                              ...props.course,
                              name: courseName ?? '',
                          })
                        : undefined
                }
            />
            <GradeSelector
                disabled={!props.course}
                grade={
                    props.overrideClass
                        ? props.overrideClass.grade
                        : props.transcriptClass?.grade
                }
                onChange={(value) => {
                    if (!props.onOverrideChange || !props.course) {
                        return
                    }
                    const oldClass =
                        props.overrideClass ?? props.transcriptClass
                    pushOverrideChange({
                        prefix: props.course.prefix,
                        course: props.course.number,
                        name: props.course.name,
                        otherGrades: [],
                        transfer: false,
                        fastTrack: false,
                        ...oldClass,
                        grade: value,
                    })
                }}
            />

            <Autocomplete
                disabled={!props.course}
                options={transferOptions}
                sx={{ width: 160 }}
                title="Taken as"
                renderInput={(params) => (
                    <TextField {...params} label="Taken As" />
                )}
                value={
                    (props.overrideClass ?? props.transcriptClass)?.fastTrack
                        ? transferOptions[1]
                        : (props.overrideClass ?? props.transcriptClass)
                              ?.transfer
                        ? transferOptions[0]
                        : null
                }
                onChange={(_, value) => {
                    if (!props.onOverrideChange || !props.course) {
                        return
                    }
                    const oldClass =
                        props.overrideClass ?? props.transcriptClass
                    pushOverrideChange({
                        prefix: props.course.prefix,
                        course: props.course.number,
                        name: props.course.name,
                        otherGrades: [],
                        grade: {},
                        ...oldClass,
                        transfer: value ? true : false,
                        fastTrack: value === transferOptions[1],
                    })
                }}
            />

            <ButtonGroup variant="contained">
                <Button onClick={props.onRemove}>
                    <Delete />
                </Button>
                {edited ? (
                    <Button
                        onClick={(e) =>
                            props.onOverrideChange
                                ? props.onOverrideChange(undefined)
                                : null
                        }
                    >
                        <RestartAlt />
                    </Button>
                ) : null}
            </ButtonGroup>
        </Box>
    )
}
