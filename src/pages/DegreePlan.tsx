import styled from '@emotion/styled'
import { Clear, ImportExport, Print, SafetyCheck } from '@mui/icons-material'
import { Box, Checkbox, Fab, FormControlLabel, FormGroup } from '@mui/material'
import { useRef } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import DegreePlanRow from '../components/DegreePlanRow'
import SaveStudentButton from '../components/SaveStudentButton'
import SemesterSelector from '../components/SemesterSelector'
import { DegreePlanRequiredCourse } from '../features/degreePlan/model/degreePlanRequiredCourse'
import reset from '../features/reset'
import { setAdmission, setFastTrack, setThesis } from '../features/student'
import importTranscript from '../features/student/importTranscript'

export default function DegreePlan() {
    const dispatch = useAppDispatch()
    const [degreePlan, student] = useAppSelector((state) => [
        state.degreePlan,
        state.student,
    ])
    const transcriptInput = useRef<HTMLInputElement>(null)

    const TopInfo = styled.p`
        text-align: center;
    `

    const CourseGroupHeader = styled.div`
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    `

    const CourseGroupCenterHeader = styled.div`
        display: flex;
        justify-content: center;
        margin-top: 20px;
    `

    const Header = styled.p`
        margin: 0px;
    `

    const formatClass = (
        c: DegreePlanRequiredCourse | undefined,
        i: number
    ) => {
        const classKey = `${c?.prefix} ${c?.number}`
        return (
            <DegreePlanRow
                key={i}
                course={c ?? undefined}
                overrideClass={degreePlan.classOverrides[classKey]}
                transcriptClass={student.transcript?.classes[classKey]}
                // onChange={(v) => {
                //     setRows([
                //         ...rows.slice(0, i),
                //         v ?? '',
                //         ...rows.slice(i + 1),
                //     ])
                // }}
                // onAdd={() => {
                //     setRows([...rows, ''])
                // }}
                // onRemove={() => {
                //     if (rows.length > 1) {
                //         setRows([
                //             ...rows.slice(0, i),
                //             ...rows.slice(i + 1),
                //         ])
                //     } else {
                //         setRows([''])
                //     }
                // }}
            />
        )
    }

    const groups = Object.keys(degreePlan.requirements).map((key, i) => {
        const requirementGroup = degreePlan.requirements[key]

        const classElements = !requirementGroup.classes
            ? undefined
            : [...requirementGroup.classes, undefined].map(formatClass)

        const classGroups = requirementGroup.groups?.map((g, j) => {
            const groupClasses = [...g.classes, undefined].map(formatClass)
            return (
                <Box
                    key={j}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: '9px',
                    }}
                >
                    {requirementGroup.classes || j > 0 ? (
                        <CourseGroupCenterHeader>
                            <Header>
                                {g.title
                                    ? g.title
                                    : `${
                                          g.countRequired
                                      } of the following Course${
                                          g.classes.length > 1 ? 's' : null
                                      }`}
                                {g.creditHours
                                    ? ` (${g.creditHours} Credit Hours)`
                                    : null}
                            </Header>
                        </CourseGroupCenterHeader>
                    ) : (
                        <CourseGroupHeader>
                            <Header>
                                {g.countRequired} {requirementGroup.name}
                            </Header>
                            {g.creditHours ? (
                                <Header>({g.creditHours} Credit Hours)</Header>
                            ) : null}
                            {requirementGroup.gpaRequired ? (
                                <Header>
                                    {requirementGroup.gpaRequired.toFixed(2)}{' '}
                                    GPA Required
                                </Header>
                            ) : null}
                        </CourseGroupHeader>
                    )}
                    {groupClasses}
                </Box>
            )
        })

        let creditHours = requirementGroup.classes?.reduce(
            (val, c) => val + +(c?.number.toString()[1] ?? '0'),
            0
        )
        if (creditHours === 0) {
            creditHours = undefined
        }
        return (
            <Box
                key={i}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {requirementGroup.classes ||
                (requirementGroup.groups?.length ?? 0) === 0 ? (
                    <CourseGroupHeader>
                        <Header>{requirementGroup.name}</Header>
                        {creditHours ? (
                            <Header>({creditHours} Credit Hours)</Header>
                        ) : null}
                        {requirementGroup.gpaRequired ? (
                            <Header>
                                {requirementGroup.gpaRequired.toFixed(2)} GPA
                                Required
                            </Header>
                        ) : null}
                    </CourseGroupHeader>
                ) : null}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: '9px',
                    }}
                >
                    {classElements}
                </Box>
                {classGroups}
            </Box>
        )
    })

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.1em',
            }}
        >
            {!degreePlan.loaded ? <Navigate to={'/'} /> : null}
            <TopInfo>
                Name: {student.transcript?.name} <br />
                ID: {student.transcript?.id} <br />
                Major: {degreePlan.major} <br />
                Track: {degreePlan.track} <br />
            </TopInfo>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignSelf: 'stretch',
                }}
            >
                <SemesterSelector
                    semester={student.transcript?.semesterAdmitted}
                    postfix=" Admitted"
                    semesterWidth={130}
                    yearWidth={100}
                    onChange={(value) =>
                        value ? dispatch(setAdmission(value)) : null
                    }
                />
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={student.additionalInfo.fastTrack}
                                onChange={(e) =>
                                    dispatch(setFastTrack(e.target.checked))
                                }
                            />
                        }
                        title="Fast Track"
                        label="Fast Track"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={student.additionalInfo.thesis}
                                onChange={(e) =>
                                    dispatch(setThesis(e.target.checked))
                                }
                            />
                        }
                        title="Pursuing Thesis"
                        label="Pursuing Thesis"
                    />
                </FormGroup>
            </Box>
            {groups}
            <Box
                sx={{
                    display: 'flex',
                    alignSelf: 'stretch',
                    justifyContent: 'center',
                    marginTop: '20px',
                    gap: '20px',
                }}
            >
                <Fab
                    variant="extended"
                    size="large"
                    onClick={() => dispatch(reset())}
                    title="Reset"
                >
                    <Clear />
                    Reset
                </Fab>

                <SaveStudentButton />

                <Link to="/print">
                    <Fab variant="extended" size="large">
                        <Print />
                        Print
                    </Fab>
                </Link>

                <Link to="/audit">
                    <Fab variant="extended" size="large">
                        <SafetyCheck />
                        Run Audit
                    </Fab>
                </Link>
                <input
                    type="file"
                    ref={transcriptInput}
                    style={{ display: 'none' }}
                    accept="application/pdf"
                    onChange={(e) =>
                        e.target.files
                            ? dispatch(importTranscript(e.target.files[0]))
                            : null
                    }
                />
                <Fab
                    variant="extended"
                    size="large"
                    onClick={() => {
                        transcriptInput.current?.click()
                    }}
                    title="Update Transcript"
                >
                    <ImportExport />
                    Update Transcript
                </Fab>
            </Box>
        </Box>
    )
}
