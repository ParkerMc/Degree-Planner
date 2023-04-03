import {
    Autocomplete,
    Box,
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
import ArrowBack from '@mui/icons-material/ArrowBack'
import reset from '../features/reset'

export default function AdditionalInformation() {
    const dispatch = useAppDispatch()
    const [
        transcriptLoaded,
        degreePlanLoaded,
        requirements,
        major,
        track,
        fastTrack,
        pursuingThesis,
    ] = useAppSelector((state) => [
        state.student.transcript !== undefined,
        state.degreePlan.loaded,
        state.trackRequirements,
        state.student.transcript?.major ?? '',
        state.student.additionalInfo.track,
        state.student.additionalInfo.fastTrack,
        state.student.additionalInfo.thesis,
    ])

    const tracks = Object.keys(requirements)
        .map((key) => requirements[key])
        .filter((r) => r.major === major)
        .map((r) => ({
            label: r.name,
        }))

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {degreePlanLoaded ? (
                <Navigate to={'/degreePlan'} />
            ) : !transcriptLoaded ? (
                <Navigate to={'/'} />
            ) : null}
            <Autocomplete
                openOnFocus
                options={tracks}
                sx={{ width: 300 }}
                renderInput={(params) => (
                    <TextField {...params} label="Track" />
                )}
                value={
                    track !== undefined
                        ? tracks.find((t) => t.label === track) ?? null
                        : null
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
            <Box
                sx={{
                    display: 'flex',
                    alignSelf: 'stretch',
                    justifyContent: 'space-evenly',
                    gap: '10px',
                }}
            >
                <Button
                    disabled={track === undefined}
                    variant="contained"
                    onClick={() => dispatch(reset())}
                >
                    <ArrowBack /> Back
                </Button>
                <Button
                    disabled={track === undefined}
                    variant="contained"
                    onClick={() => dispatch(setupDegreePlan(track))}
                >
                    Continue
                </Button>
            </Box>
        </Box>
    )
}
