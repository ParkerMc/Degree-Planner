import styled from '@emotion/styled'
import { Fab, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { ImportExport, Upload } from '@mui/icons-material'

// TODO add drag and drop support
export default function Home() {
    const studentDataInput = useRef<HTMLInputElement>(null)
    const transcriptInput = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `

    const studentDataFileSelected = (filePath: string) => {
        console.log(filePath)
        navigate('/degreePlan')
    }
    const transcriptFileSelected = (filePath: string) => {
        console.log(filePath)
        navigate('/additionalInfo')
    }

    return (
        <Container>
            <h2>Select an option below</h2>
            <p>Or drop a file anywhere in this window(TODO)</p>
            <Grid container spacing={4}>
                <Grid item>
                    <input
                        type="file"
                        ref={studentDataInput}
                        style={{ display: 'none' }}
                        accept="application/JSON"
                        onChange={(e) =>
                            studentDataFileSelected(e.target.value)
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
                        onChange={(e) => transcriptFileSelected(e.target.value)}
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
