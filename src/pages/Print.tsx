import styled from '@emotion/styled'
import { useAppSelector } from '../app/hooks'
import { Fragment } from 'react'
import { RequiredCourse } from '../features/trackRequirements/model'
import {
    CheckBoxOutlineBlankOutlined,
    CheckBoxOutlined,
} from '@mui/icons-material'

export default function Print() {
    const [degreePlan, student] = useAppSelector((state) => [
        state.degreePlan,
        state.student,
    ])

    const Table = styled.table`
        color: black;
        background-color: white;
        border: 1px solid black;
        border-collapse: collapse;
    `

    const Tr = styled.tr`
        border: 1px solid black;
        border-collapse: collapse;
    `
    const Th = styled.th`
        border: 1px solid black;
        border-collapse: collapse;
    `
    const Header = styled.p`
        margin: 0px;
    `
    const HeaderContainer = styled.div`
        display: flex;
        justify-content: space-between;
    `
    const formatClass = (c: RequiredCourse | undefined, i: number) => {
        const classKey = `${c?.prefix} ${c?.number}`
        const transcriptCourse =
            degreePlan.classOverrides[classKey] ??
            student.transcript?.classes[classKey]
        return (
            <Tr key={i}>
                <Th>{c?.name}</Th>
                <Th>{classKey}</Th>
                <Th>
                    {transcriptCourse?.semester.year.toString().slice(-2)}{' '}
                    {transcriptCourse?.semester.semester}
                </Th>
                <Th></Th>
                <Th>{transcriptCourse?.grade}</Th>
            </Tr>
        )
    }
    const groups = Object.keys(degreePlan.requirements).map((key, i) => {
        const requirementGroup = degreePlan.requirements[key]
        const classElements = requirementGroup.classes?.map(formatClass)
        const classGroups = requirementGroup.groups?.map((g, j) => {
            const groupClasses = g.classes.map(formatClass)
            return (
                <Fragment key={j}>
                    <Tr>
                        <Th colSpan={5}>
                            {g.countRequired} Courses below required
                        </Th>
                    </Tr>
                    {groupClasses}
                </Fragment>
            )
        })
        return (
            <Fragment key={i}>
                <Tr>
                    <Th colSpan={5}>
                        {requirementGroup.name} - {requirementGroup.gpaRequired}{' '}
                        GPA Required
                    </Th>
                </Tr>
                {classElements}
                {classGroups}
            </Fragment>
        )
    })

    return (
        <Table>
            <Tr>
                <Th colSpan={5}>
                    <Header>DEGREE PLAN</Header>
                    <Header>UNIVERSITY OF TEXAS AT DALLAS</Header>
                    <Header>
                        MASTER OF {student.transcript?.major.toUpperCase()}
                    </Header>

                    <br />
                    <Header>{degreePlan.track}</Header>
                    <br />
                    <HeaderContainer>
                        <div>
                            <Header>
                                Name of Student: {student.transcript?.name}
                            </Header>
                            <Header>
                                Student I.D. Number: {student.transcript?.id}
                            </Header>
                            <Header>
                                Semester Admitted To Program:{' '}
                                {student.transcript?.semesterAdmitted.year
                                    .toString()
                                    .slice(-2)}{' '}
                                {student.transcript?.semesterAdmitted.semester}
                            </Header>
                        </div>
                        <div>
                            <Header>
                                FT:{' '}
                                {student.additionalInfo.fastTrack ? (
                                    <CheckBoxOutlined />
                                ) : (
                                    <CheckBoxOutlineBlankOutlined />
                                )}
                            </Header>
                            <Header>
                                Thesis:{' '}
                                {student.additionalInfo.thesis ? (
                                    <CheckBoxOutlined />
                                ) : (
                                    <CheckBoxOutlineBlankOutlined />
                                )}
                            </Header>
                            <Header>Anticipated Graduation_______</Header>
                        </div>
                    </HeaderContainer>
                </Th>
            </Tr>
            <Tr>
                <Th>Course Title</Th>
                <Th>Course Number</Th>
                <Th>UTD Semester</Th>
                <Th>Transfer</Th>
                <Th>Grade</Th>
            </Tr>
            {groups}
        </Table>
    )
}
