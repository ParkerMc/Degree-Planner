import styled from '@emotion/styled'
import {
    Autocomplete,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
} from '@mui/material'
import { Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import setupDegreePlan from '../features/degreePlan/setupDegreePlan'
import { setFastTrack, setThesis, setTrack } from '../features/student'

export default function AdditionalInformation() {
    const dispatch = useAppDispatch()
    const [
        degreePlanLoaded,
        requirements,
        major,
        track,
        fastTrack,
        pursuingThesis,
    ] = useAppSelector((state) => [
        state.degreePlan.loaded,
        state.trackRequirements,
        state.student.transcript?.major ?? '',
        state.student.additionalInfo.track,
        state.student.additionalInfo.fastTrack,
        state.student.additionalInfo.thesis,
    ])

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `

    const tracks = Object.keys(requirements)
        .map((key) => requirements[key])
        .filter((r) => r.major === major)
        .map((r) => ({
            label: r.name,
        }))

    return (
        <Container>
            {degreePlanLoaded ? <Navigate to={'/degreePlan'} /> : null}
            <Autocomplete
                openOnFocus
                options={tracks}
                sx={{ width: 300 }}
                renderInput={(params) => (
                    <TextField {...params} label="Track" />
                )}
                value={
                    track !== undefined
                        ? tracks.find((t) => t.label === track)
                        : undefined
                }
                onChange={(_, value) => {
                    dispatch(setTrack(value?.label ?? ''))
                }}
            />
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={fastTrack}
                            onChange={(e) =>
                                dispatch(setFastTrack(e.target.checked))
                            }
                        />
                    }
                    label="Fast Track"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={pursuingThesis}
                            onChange={(e) =>
                                dispatch(setThesis(e.target.checked))
                            }
                        />
                    }
                    label="Pursuing Thesis"
                />
            </FormGroup>
            <Button
                disabled={track === undefined}
                variant="contained"
                onClick={() => dispatch(setupDegreePlan(track))}
            >
                Continue
            </Button>
        </Container>
    )
}
