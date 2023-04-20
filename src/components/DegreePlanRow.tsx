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
import SemesterSelector from './SemesterSelector'

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

    // TODO handle courseOptions when course is undefined
    // TODO support changing transcriptClass
    const courseOptions = [
        {
            label: `${props.course?.prefix} ${props.course?.number}`,
        },
    ]

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
            <SemesterSelector
                disabled={!props.course}
                semester={
                    props.overrideClass
                        ? props.overrideClass.grade?.semester
                        : props.transcriptClass?.grade?.semester
                }
                onChange={(value) => {
                    if (!props.onOverrideChange || !props.course) {
                        return
                    }
                    const oldClass =
                        props.overrideClass ?? props.transcriptClass
                    props.onOverrideChange({
                        prefix: props.course.prefix,
                        course: props.course.number,
                        name: props.course.name,
                        otherGrades: [],
                        transfer: false,
                        fastTrack: false, // TODO add fastrack and transfer fields
                        ...oldClass,
                        grade: {
                            semester: value,
                            grade: oldClass?.grade.grade,
                        },
                    })
                }}
            />
            {/* TODO change to autocomplete (maybe) */}
            <TextField
                disabled={!props.course}
                sx={{ width: 100 }}
                label="Grade"
                value={
                    (props.overrideClass
                        ? props.overrideClass.grade?.grade
                        : props.transcriptClass?.grade?.grade) ?? undefined
                }
                onChange={(e) => {
                    if (!props.onOverrideChange || !props.course) {
                        return
                    }
                    const oldClass =
                        props.overrideClass ?? props.transcriptClass
                    props.onOverrideChange({
                        prefix: props.course.prefix,
                        course: props.course.number,
                        name: props.course.name,
                        otherGrades: [],
                        transfer: false,
                        fastTrack: false, // TODO add fastrack and transfer fields
                        ...oldClass,
                        grade: {
                            semester: oldClass?.grade.semester,
                            grade: e.target.value,
                        },
                    })
                }}
                // onBlur={(e) =>
                //     props.onCourseChange &&
                //     props.course &&
                //     props.course.name !== courseName
                //         ? props.onCourseChange({
                //               ...props.course,
                //               name: courseName ?? '',
                //           })
                //         : undefined
                // }
            />
            <ButtonGroup variant="contained">
                <Button onClick={props.onRemove}>
                    <Delete />
                </Button>
                {
                    edited ? (
                        <Button
                            onClick={(e) =>
                                props.onOverrideChange
                                    ? props.onOverrideChange(undefined)
                                    : null
                            }
                        >
                            <RestartAlt />
                        </Button>
                    ) : null // TODO fix layout with button
                    // TODO fix field change when new transcript is imported or field is resetf
                }
            </ButtonGroup>
        </Box>
    )
}
