import { Clear, Print, SafetyCheck } from '@mui/icons-material'
import { Box, Fab } from '@mui/material'
import { Link, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import DegreePlanRow from '../components/DegreePlanRow'
import SaveStudentButton from '../components/SaveStudentButton'
import reset from '../features/reset'

export default function DegreePlan() {
    const dispatch = useAppDispatch()
    const [degreePlan, studentName, studentId, classes] = useAppSelector(
        (state) => [
            state.degreePlan,
            state.student.transcript?.name,
            state.student.transcript?.id,
            state.student.transcript?.classes ?? {},
        ]
    )

    const groups = Object.keys(degreePlan.requirements).map((key, i) => {
        const requirementGroup = degreePlan.requirements[key]
        const classElements = requirementGroup.classes?.map((c, j) => (
            <DegreePlanRow
                key={j}
                course={c}
                transcriptClass={classes[`${c?.prefix} ${c?.number}`]}
                add={j === requirementGroup.classes!.length - 1}
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
        ))
        const classGroups = requirementGroup.groups?.map((g, j) => {
            const groupClasses = g.classes.map((c, k) => (
                <DegreePlanRow
                    key={k}
                    course={c}
                    transcriptClass={classes[`${c?.prefix} ${c?.number}`]}
                    add={k === g.classes.length - 1}
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
            ))
            return (
                <Box key={j}>
                    {g.countRequired} Courses below required{groupClasses}
                </Box>
            )
        })
        return (
            <Box key={i}>
                <p>
                    {requirementGroup.name} - {requirementGroup.gpaRequired} GPA
                    Required
                </p>
                {classElements}
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
            }}
        >
            {!degreePlan.loaded ? <Navigate to={'/'} /> : null}
            <h2>{studentName}</h2>
            <h3>ID: {studentId}</h3>
            <h3>Major: {degreePlan.major}</h3>
            <h3>Track: {degreePlan.track}</h3>
            {groups}
            <Box
                sx={{
                    display: 'flex',
                    alignSelf: 'stretch',
                    justifyContent: 'center',
                    gap: '20px',
                }}
            >
                {/* TODO add update transcript button */}

                <Fab
                    variant="extended"
                    size="large"
                    onClick={() => dispatch(reset())}
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
            </Box>
        </Box>
    )
}
