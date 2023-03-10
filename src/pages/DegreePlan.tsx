import styled from '@emotion/styled'
import { Print, SafetyCheck } from '@mui/icons-material'
import { Box, Fab, Grid } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import DegreePlanRow from '../components/DegreePlanRow'
import SaveStudentButton from '../components/SaveStudentButton'

export default function DegreePlan() {
    const [rows, setRows] = useState([''])

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `

    return (
        <Container>
            <h1>Degree Plan Page</h1>
            <Box>
                {rows.map((value, i) => (
                    <DegreePlanRow
                        key={i}
                        add={i === rows.length - 1}
                        value={value}
                        onChange={(v) => {
                            setRows([
                                ...rows.slice(0, i),
                                v ?? '',
                                ...rows.slice(i + 1),
                            ])
                        }}
                        onAdd={() => {
                            setRows([...rows, ''])
                        }}
                        onRemove={() => {
                            if (rows.length > 1) {
                                setRows([
                                    ...rows.slice(0, i),
                                    ...rows.slice(i + 1),
                                ])
                            } else {
                                setRows([''])
                            }
                        }}
                    />
                ))}
            </Box>
            <Grid container spacing={2}>
                <Grid item>
                    <SaveStudentButton />
                </Grid>
                <Grid item>
                    <Link to="/print">
                        <Fab variant="extended" size="large">
                            <Print />
                            Print
                        </Fab>
                    </Link>
                </Grid>
                <Grid item>
                    <Link to="/audit">
                        <Fab variant="extended" size="large">
                            <SafetyCheck />
                            Run Audit
                        </Fab>
                    </Link>
                </Grid>
            </Grid>
        </Container>
    )
}
