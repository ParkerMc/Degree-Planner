import {
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Class } from '../features/student/model'
import { RequiredCourse } from '../features/trackRequirements/model'
import { DegreePlanRequiredCourse } from '../features/degreePlan/model'
import { Delete, RestartAlt } from '@mui/icons-material'
import GradeSelector from './GradeSelector'

interface DegreePlanRowProps {
    course?: DegreePlanRequiredCourse
    transcriptClass?: Class
    overrideClass?: Class
    suggestedClasses?: RequiredCourse[]
    allClassesSortedNumber?: Class[]
    allClassesSortedName?: Class[]
    onOverrideChange?: (value?: Class) => void
    onCourseChange?: (value: RequiredCourse) => void
    onRemove?: () => void
}

export default function DegreePlanRow(props: DegreePlanRowProps) {
    const [courseName, setCourseName] = useState(
        props.course?.name === '' ? undefined : props.course?.name
    )
    const [courseNumber, setCourseNumber] = useState(
        props.course
            ? `${props.course?.prefix} ${props.course?.number}`
            : undefined
    )

    useEffect(() => {
        setCourseName(
            props.course?.name === '' ? undefined : props.course?.name
        )
        setCourseNumber(
            props.course
                ? `${props.course?.prefix} ${props.course?.number}`
                : undefined
        )
    }, [props.course])

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

    const transferOptions = ['Transfer', 'Fast Track'].map((v) => ({
        label: v,
    }))

    const edited = props.overrideClass

    let courseNumbers =
        props.allClassesSortedNumber?.map((c) => `${c.prefix} ${c.course}`) ??
        []

    if (props.suggestedClasses && props.suggestedClasses.length > 0) {
        courseNumbers = props.suggestedClasses
            .map((c) => `${c.prefix} ${c.number}`)
            .concat(courseNumbers)
            .filter((n, i, self) => self.indexOf(n) === i) // limit to Unique
    }

    if (courseNumber && courseNumbers.indexOf(courseNumber) < 0) {
        courseNumbers = [...courseNumbers, courseNumber]
    }
    const courseNumberOptions = courseNumbers.map((n) => ({
        label: n,
    }))

    let courseNames = props.allClassesSortedName?.map((c) => c.name) ?? []

    if (props.suggestedClasses && props.suggestedClasses.length > 0) {
        courseNames = props.suggestedClasses
            .map((c) => c.name)
            .concat(courseNames)
            .filter((n, i, self) => self.indexOf(n) === i) // limit to Unique
    }

    if (courseName && courseNames.indexOf(courseName) < 0) {
        courseNames = [...courseNames, courseName]
    }
    const courseNameOptions = courseNames.map((n) => ({
        label: n,
    }))

    return (
        <Box sx={{ display: 'flex', gap: '10px' }}>
            {/* TODO allow freetext */}
            <Autocomplete
                options={courseNumberOptions}
                title="Course Number"
                sx={{ width: 200 }}
                renderInput={(params) => (
                    <TextField {...params} label="Course Number" />
                )}
                value={
                    props.course
                        ? courseNumberOptions.find(
                              (c) => c.label === courseNumber
                          ) ?? null
                        : null
                }
                onChange={(_, value) => {
                    let newCourseName = props.suggestedClasses?.find(
                        (c) => `${c.prefix} ${c.number}` === value?.label
                    )?.name

                    if (!newCourseName) {
                        newCourseName = props.allClassesSortedName?.find(
                            (c) => `${c.prefix} ${c.course}` === value?.label
                        )?.name
                    }

                    const split = value?.label.split(' ')
                    if (!split) {
                        return
                    }

                    setCourseNumber(value?.label)
                    setCourseName(newCourseName)

                    if (props.onCourseChange) {
                        props.onCourseChange({
                            prefix: split[0],
                            number: +split[1],
                            name: newCourseName ?? '',
                        })
                    }
                }}
            />

            <Autocomplete
                options={courseNameOptions}
                sx={{ width: 410 }}
                title="Course Name"
                renderInput={(params) => (
                    <TextField {...params} label="Course Name" />
                )}
                value={
                    props.course
                        ? courseNameOptions.find(
                              (c) => c.label === courseName
                          ) ?? null
                        : null
                }
                onChange={(_, value) => {
                    let newCourse = props.suggestedClasses?.find(
                        (c) => c.name === value?.label
                    )

                    if (!newCourse) {
                        const course = props.allClassesSortedName?.find(
                            (c) => c.name === value?.label
                        )
                        if (course) {
                            newCourse = {
                                prefix: course.prefix,
                                number: course.course,
                                name: course.name,
                            }
                        }
                    }

                    const newCourseNumber = newCourse
                        ? `${newCourse.prefix} ${newCourse.number}`
                        : ''

                    if (!newCourse) {
                        return
                    }

                    setCourseNumber(newCourseNumber)
                    setCourseName(value?.label ?? '')
                    if (props.onCourseChange) {
                        props.onCourseChange({
                            prefix: newCourse.prefix,
                            number: newCourse.number,
                            name: value?.label ?? '',
                        })
                    }
                }}
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
                {props.course ? (
                    <Button title="Delete Requirement" onClick={props.onRemove}>
                        <Delete />
                    </Button>
                ) : null}
                {edited ? (
                    <Button
                        title="Reset Grade"
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
