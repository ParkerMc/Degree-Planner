import { Box, Button, ButtonGroup, TextField } from '@mui/material'
import { useState } from 'react'

interface DegreePlanRowProps {
    add?: boolean
    value?: string
    onChange?: (value?: string) => void
    onAdd?: () => void
    onRemove?: () => void
}

export default function DegreePlanRow(props: DegreePlanRowProps) {
    const [value, setValue] = useState(props.value)
    return (
        <Box>
            <TextField
                label="Class"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={(e) =>
                    props.onChange && value !== props.value
                        ? props.onChange(value)
                        : null
                }
            />
            <ButtonGroup variant="contained">
                <Button onClick={props.onRemove}>-</Button>
                {props.add ? <Button onClick={props.onAdd}>+</Button> : null}
            </ButtonGroup>
        </Box>
    )
}
