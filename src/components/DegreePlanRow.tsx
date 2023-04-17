import {
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    TextField,
} from '@mui/material'
import { useState } from 'react'
import { Class, Semester } from '../features/student/model'
import { RequiredCourse } from '../features/trackRequirements/model'
import { DegreePlanRequiredCourse } from '../features/degreePlan/model/degreePlanRequiredCourse'
import { Delete, RestartAlt } from '@mui/icons-material'

interface DegreePlanRowProps {
    course?: DegreePlanRequiredCourse
    transcriptClass?: Class
    overrideClass?: Class
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

    const semesters = Object.values(Semester)
        .filter((s) => s !== 'N/A')
        .map((s) => ({
            label: s,
        }))

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
            <Autocomplete
                options={semesters}
                sx={{ width: 200 }}
                renderInput={(params) => (
                    <TextField {...params} label="Semester" />
                )}
                value={semesters.find(
                    (s) =>
                        s.label ===
                        props.transcriptClass?.grade.semester.semester
                )}
                // onChange={(_, value) => {
                //     if (!props.onCourseChange) {
                //         return
                //     }

                //     // TODO error check value
                //     if (!value) {
                //         props.onCourseChange(undefined)
                //         return
                //     }
                //     const split = value.label.split(' ')
                //     props.onCourseChange({
                //         prefix: split[0],
                //         number: +split[1],
                //         name: '',
                //     })
                // }}
            />
            <TextField
                sx={{ width: 100 }}
                label="Year"
                type={'number'}
                value={props.transcriptClass?.grade.semester.year}
                // onChange={(e) => setCourseName(e.target.value)}
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
            {/* TODO change to autocomplete (maybe) */}
            <TextField
                sx={{ width: 100 }}
                label="Grade"
                value={props.transcriptClass?.grade.grade}
                // onChange={(e) => setCourseName(e.target.value)}
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
                <Button>
                    <RestartAlt />
                </Button>
                {/* {props.add ? <Button onClick={props.onAdd}>+</Button> : null} */}
            </ButtonGroup>
        </Box>
    )
}
