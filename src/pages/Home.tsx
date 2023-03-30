import styled from '@emotion/styled'
import { Fab, Grid } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { useRef } from 'react'
import { ImportExport, Upload } from '@mui/icons-material'
import importTranscript from '../features/student/importTranscript'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import importSave from '../features/importSave'

// TODO add drag and drop support
export default function Home() {
    const [transcriptLoaded, degreePlanLoaded] = useAppSelector((state) => [
        state.student.transcript !== undefined,
        state.degreePlan.loaded,
    ])
    const dispatch = useAppDispatch()
    const transcriptInput = useRef<HTMLInputElement>(null)
    const studentDataInput = useRef<HTMLInputElement>(null)

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `

    const studentDataFileSelected = (files: FileList | null) => {
        if (!files) {
            return
        }
        dispatch(importSave(files[0]))
    }
    const transcriptFileSelected = (files: FileList | null) => {
        if (!files) {
            return
        }
        dispatch(importTranscript(files[0]))
    }

    return (
        <Container>
            <h2>Select an option below</h2>
            <p>Or drop a file anywhere in this window(TODO)</p>
            {transcriptLoaded ? (
                degreePlanLoaded ? (
                    <Navigate to={'/degreePlan'} />
                ) : (
                    <Navigate to={'/additionalInfo'} />
                )
            ) : undefined}

            <Grid container spacing={4}>
                <Grid item>
                    <input
                        type="file"
                        ref={studentDataInput}
                        style={{ display: 'none' }}
                        accept="application/JSON"
                        onChange={(e) =>
                            studentDataFileSelected(e.target.files)
                        }
                    />
                    <Fab
                        variant="extended"
                        size="large"
                        onClick={() => {
                            studentDataInput.current?.click()
                        }}
                    >
                        <Upload />
                        Upload Student Data
                    </Fab>
                </Grid>
                <Grid item>
                    <input
                        type="file"
                        ref={transcriptInput}
                        style={{ display: 'none' }}
                        accept="application/pdf"
                        onChange={(e) => transcriptFileSelected(e.target.files)}
                    />
                    <Fab
                        variant="extended"
                        size="large"
                        onClick={() => {
                            transcriptInput.current?.click()
                        }}
                    >
                        <ImportExport />
                        Import Transcript
                    </Fab>
                </Grid>
            </Grid>
        </Container>
    )
}
