import styled from '@emotion/styled'
import {
    Autocomplete,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdditionalInformation() {
    const [track, setTrack] = useState<number>()
    const [fastTrack, setFastTrack] = useState(false)
    const [pursuingThesis, setPursuingThesis] = useState(false)
    const navigate = useNavigate()

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `

    const tracks = [
        'Cyber Security',
        'Data Science',
        'Intelligent Systems',
        'Interactive Computing',
        'Networks and Telecommunications',
        'Systems',
        'Traditional Computer Science',
        'Software Engineering',
    ].map((label, id) => ({
        label,
        id,
    }))

    return (
        <Container>
            <Autocomplete
                openOnFocus
                options={tracks}
                sx={{ width: 300 }}
                renderInput={(params) => (
                    <TextField {...params} label="Track" />
                )}
                value={track !== undefined ? tracks[track] : undefined}
                onChange={(_, value) => {
                    setTrack(value?.id)
                    console.log(value)
                }}
            />
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={fastTrack}
                            onChange={(e) => setFastTrack(e.target.checked)}
                        />
                    }
                    label="Fast Track"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={pursuingThesis}
                            onChange={(e) =>
                                setPursuingThesis(e.target.checked)
                            }
                        />
                    }
                    label="Pursuing Thesis"
                />
            </FormGroup>
            <Button
                disabled={track === undefined}
                variant="contained"
                onClick={() => navigate('/degreePlan')}
            >
                Continue
            </Button>
        </Container>
    )
}
