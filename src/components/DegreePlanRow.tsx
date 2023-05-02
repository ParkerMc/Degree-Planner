import {
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    TextField,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
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

    const [courseNumberErrorMessage, setCourseNumberErrorMessage] = useState<
        string | undefined
    >(undefined)

    const getErrorMessage = (
        newCourseNumber?: string,
        curCourseName?: string
    ) => {
        if (!newCourseNumber) {
            if (curCourseName && curCourseName !== '') {
                return 'Must have a course number'
            }
            return
        }

        const split = newCourseNumber.split(' ')

        if (split.length !== 2) {
            return 'Must have prefix and number'
        }

        if (isNaN(+split[1])) {
            return 'Second part must be be a number'
        }
    }

    const getErrorMessageCallback = useCallback(getErrorMessage, [])

    useEffect(() => {
        const tmpNumber = props.course
            ? `${props.course?.prefix} ${props.course?.number}`
            : undefined
        const tmpName =
            props.course?.name === '' ? undefined : props.course?.name
        setCourseName(tmpName)
        setCourseNumber(tmpNumber)
        setCourseNumberErrorMessage(getErrorMessageCallback(tmpNumber, tmpName))
    }, [props.course, getErrorMessageCallback])

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

    const onCourseNumberChange = (value: null | string | { label: string }) => {
        const newCourseNumber =
            typeof value !== 'string'
                ? value?.label
                : value !== ''
                ? value.toUpperCase()
                : undefined

        if (!newCourseNumber && props.course) {
            const tmp = courseNumber
            setCourseNumber('')

            setTimeout(() => setCourseNumber(tmp), 100)
            return
        }

        let newCourseName = props.suggestedClasses?.find(
            (c) => `${c.prefix} ${c.number}` === newCourseNumber
        )?.name

        if (!newCourseName) {
            newCourseName =
                props.allClassesSortedName?.find(
                    (c) => `${c.prefix} ${c.course}` === newCourseNumber
                )?.name ?? courseNumber
                    ? undefined
                    : courseName
        }

        const errorMessage = getErrorMessage(newCourseNumber, courseName)
        setCourseNumber(newCourseNumber)
        setCourseName(newCourseName)
        setCourseNumberErrorMessage(errorMessage)

        const split = newCourseNumber?.split(' ')
        if (props.onCourseChange && split && !errorMessage) {
            props.onCourseChange({
                prefix: split[0],
                number: +split[1],
                name: newCourseName ?? '',
            })
        }
    }

    const onCourseNameChange = (value: null | string | { label: string }) => {
        const newCourseName =
            typeof value !== 'string'
                ? value?.label
                : value !== ''
                ? value
                : undefined

        if (!newCourseName && courseNumber) {
            const tmp = courseName
            setCourseName('')

            setTimeout(() => setCourseName(tmp), 100)
            return
        }

        let newCourse = props.suggestedClasses?.find(
            (c) => c.name === newCourseName
        )

        if (!newCourse) {
            const course = props.allClassesSortedName?.find(
                (c) => c.name === newCourseName
            )
            if (course) {
                newCourse = {
                    prefix: course.prefix,
                    number: course.course,
                    name: course.name,
                }
            }
        }
        setCourseName(newCourseName ?? '')
        const errorMessage = getErrorMessage(
            newCourse ? `${newCourse?.prefix} ${newCourse?.number}` : undefined,
            newCourseName
        )
        setCourseNumberErrorMessage(errorMessage)

        const newCourseNumber = newCourse
            ? `${newCourse.prefix} ${newCourse.number}`
            : ''
        if (!newCourse) {
            return
        }
        setCourseNumber(newCourseNumber)

        if (props.onCourseChange) {
            props.onCourseChange({
                prefix: newCourse.prefix,
                number: newCourse.number,
                name: newCourseName ?? '',
            })
        }
    }

    return (
        <Box sx={{ display: 'flex', gap: '10px' }}>
            <Autocomplete
                options={courseNumberOptions}
                title="Course Number"
                sx={{ width: 150 }}
                disableClearable
                freeSolo
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Course Number"
                        error={courseNumberErrorMessage !== undefined}
                        helperText={courseNumberErrorMessage}
                        onBlur={(event) =>
                            onCourseNumberChange(event.target.value)
                        }
                    />
                )}
                value={
                    props.course
                        ? courseNumberOptions.find(
                              (c) => c.label === courseNumber
                          ) ?? ''
                        : ''
                }
                onChange={(_, value) => onCourseNumberChange(value)}
            />

            <Autocomplete
                options={courseNameOptions}
                disabled={courseNumberErrorMessage !== undefined}
                sx={{ width: 380 }}
                disableClearable
                title="Course Name"
                freeSolo
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Course Name"
                        onBlur={(event) =>
                            onCourseNameChange(event.target.value)
                        }
                    />
                )}
                value={
                    props.course
                        ? courseNameOptions.find(
                              (c) => c.label === courseName
                          ) ?? ''
                        : ''
                }
                onChange={(_, value) => onCourseNameChange(value)}
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
