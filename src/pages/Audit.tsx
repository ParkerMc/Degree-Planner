import styled from '@emotion/styled'
import { useAppDispatch, useAppSelector } from '../app/hooks'

export default function Audit() {
    const Container = styled.div`
        display: flex;
        background-color: white;
        color: black;
        flex-grow: 1;
        justify-content: center;
        align-items: flex-start;
    `

    const dispatch = useAppDispatch()
    const [degreePlan, student, trackreqs] = useAppSelector((state) => [
        state.degreePlan,
        state.student,
        state.trackRequirements,
    ])
    const studentObject = student.transcript

    return (
        <Container>
            <h1>Audit Report</h1>
            <div>
                <p>Name:{studentObject?.name}</p>
                <p>Plan: Master</p>
                <p>ID: {studentObject?.id} </p>
                <p>Major: {degreePlan.major}</p>
                <p>Track: {degreePlan.track}</p>
                <p>Core Courses: </p>
                <p>Elective Courses</p>
                <p>
                    Leveling Courses and Pre-requisites from Admission Letter:
                </p>
                <p>Outstanding Requiremtents: </p>
            </div>
        </Container>
    )
}
