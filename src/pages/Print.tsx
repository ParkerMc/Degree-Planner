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

    const Container = styled.div`
        display: flex;
        background-color: white;
        flex-grow: 1;
        justify-content: center;
        align-items: flex-start;
    `

    const Table = styled.table`
        color: black;
        background-color: white;
        border: 1.5px solid black;
        border-collapse: collapse;
        line-height: 1.2;
        font-size: 14px;
    `

    const Tr = styled.tr`
        border: 1.5px solid black;
    `
    const Th = styled.th`
        padding: 0 0.5em 0 0.5em;
        border: 1.5px solid black;
    `

    const HeaderCol = styled.th`
        padding: 0.5em;
        border: 1.5px solid black;
    `

    const CourseGroupHeader = styled.div`
        display: flex;
        justify-content: space-between;
    `

    const Header = styled.p`
        margin: 0px;
    `
    const HeaderContainer = styled.div`
        display: flex;
        justify-content: space-between;
    `

    const LeftBox = styled.div`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-end;
    `

    const RightBox = styled.div`
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-end;
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
                <Th>
                    {transcriptCourse?.fastTrack
                        ? 'Fast Track'
                        : transcriptCourse?.transfer
                        ? 'Transfer'
                        : null}
                </Th>
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
                            {g.countRequired} of the following Course
                            {g.classes.length > 1 ? 's' : null}
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
                        <CourseGroupHeader>
                            <Header>{requirementGroup.name}</Header>
                            <Header>
                                (
                                {requirementGroup.classes?.reduce(
                                    (val, c) =>
                                        val + +(c?.number.toString()[1] ?? '0'),
                                    0
                                )}{' '}
                                Credit Hours)
                            </Header>
                            <Header>
                                {requirementGroup.gpaRequired} GPA Required
                            </Header>
                        </CourseGroupHeader>
                    </Th>
                </Tr>
                {classElements}
                {classGroups}
            </Fragment>
        )
    })

    return (
        <Container>
            <Table>
                <tbody>
                    <Tr>
                        <HeaderCol colSpan={5}>
                            <Header>Degree Plan</Header>
                            <Header>Univeristy of Texas at Dallas</Header>
                            <Header>
                                Master of {student.transcript?.major}
                            </Header>

                            <br />
                            <Header>{degreePlan.track}</Header>
                            <br />
                            <HeaderContainer>
                                <LeftBox>
                                    <Header>
                                        Name of Student:{' '}
                                        {student.transcript?.name}
                                    </Header>
                                    <Header>
                                        Student I.D. Number:{' '}
                                        {student.transcript?.id}
                                    </Header>
                                    <Header>
                                        Semester Admitted To Program:{' '}
                                        {student.transcript?.semesterAdmitted.year
                                            .toString()
                                            .slice(-2)}{' '}
                                        {
                                            student.transcript?.semesterAdmitted
                                                .semester
                                        }
                                    </Header>
                                </LeftBox>
                                <RightBox>
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
                                    <Header>
                                        Anticipated Graduation:___________
                                    </Header>
                                </RightBox>
                            </HeaderContainer>
                        </HeaderCol>
                    </Tr>
                    <Tr>
                        <Th>Course Title</Th>
                        <Th>Course Number</Th>
                        <Th>UTD Semester</Th>
                        <Th>Transfer</Th>
                        <Th>Grade</Th>
                    </Tr>
                    {groups}
                </tbody>
            </Table>
        </Container>
    )
}
