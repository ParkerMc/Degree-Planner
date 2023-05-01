import styled from '@emotion/styled'
import { useAppSelector } from '../app/hooks'
import {
    getGPA,
    requiredGrades,
    PredictedGrades,
} from '../features/degreePlan/gpa'
import { TranscriptData } from '../features/student/model/transcriptData'
import { Class } from '../features/student/model/'
import { RequiredCourse } from '../features/trackRequirements/model'

export default function Audit() {
    const Container = styled.div`
        display: flex;
        background-color: white;
        color: black;
        flex-grow: 1;
        justify-content: center;
        align-items: flex-start;
    `

    const [degreePlan, student] = useAppSelector((state) => [
        state.degreePlan,
        state.student,
    ])
    const studentObject = student.transcript
    let coreClasses: { [key: string]: Class } = {}
    let electiveClasses: { [key: string]: Class } = {}

    //find the elective classes
    degreePlan.requirements.electives.groups![0].classes.forEach(
        ({ prefix, number, name }) => {
            if (studentObject?.classes[`${prefix} ${number}`] !== undefined) {
                electiveClasses[`${prefix} ${number}`] =
                    studentObject?.classes[`${prefix} ${number}`]
            } else {
                electiveClasses[`${prefix} ${number}`] = {
                    prefix: prefix,
                    course: number,
                    name: name,
                    grade: {},
                    otherGrades: [],
                    transfer: false,
                    fastTrack: false,
                }
            }
        }
    )
    degreePlan.requirements.electives.groups![1].classes.forEach(
        ({ prefix, number, name }) => {
            if (studentObject?.classes[`${prefix} ${number}`] !== undefined) {
                electiveClasses[`${prefix} ${number}`] =
                    studentObject?.classes[`${prefix} ${number}`]
            } else {
                electiveClasses[`${prefix} ${number}`] = {
                    prefix: prefix,
                    course: number,
                    name: name,
                    grade: {},
                    otherGrades: [],
                    transfer: false,
                    fastTrack: false,
                }
            }
        }
    )
    //Find all core classes

    degreePlan.requirements.core.classes!.forEach(
        ({ prefix, number, name }) => {
            if (studentObject?.classes[`${prefix} ${number}`] !== undefined) {
                coreClasses[`${prefix} ${number}`] =
                    studentObject?.classes[`${prefix} ${number}`]
            } else {
                coreClasses[`${prefix} ${number}`] = {
                    prefix: prefix,
                    course: number,
                    name: name,
                    grade: {},
                    otherGrades: [],
                    transfer: false,
                    fastTrack: false,
                }
            }
        }
    )

    //find the elective core in the requirments
    let nonElectivecourses: RequiredCourse[] = []
    degreePlan.requirements.core.groups![0].classes.forEach(
        ({ prefix, number, name }) => {
            if (electiveClasses[`${prefix} ${number}`] === undefined) {
                nonElectivecourses.push({
                    prefix: prefix,
                    number: number,
                    name: name,
                })
            }
        }
    )
    // core electives not in electives, check to see if they have a grade and or date
    let gradedcourses: RequiredCourse[] = []
    let nongradedcourses: RequiredCourse[] = []
    let nonexistantcourses: RequiredCourse[] = []
    nonElectivecourses.forEach(({ prefix, number, name }) => {
        try {
            if (
                studentObject?.classes[`${prefix} ${number}`].grade.grade !==
                undefined
            ) {
                gradedcourses.push({
                    prefix: prefix,
                    number: number,
                    name: name,
                })
            } else {
                nongradedcourses.push({
                    prefix: prefix,
                    number: number,
                    name: name,
                })
            }
        } catch (e) {
            nonexistantcourses.push({
                prefix: prefix,
                number: number,
                name: name,
            })
        }
    })

    //see if the graded courses meet the requirement if not add the ones with semesters and if not choose random

    if (
        gradedcourses.length ===
        degreePlan.requirements.core.groups![0].countRequired!
    ) {
        gradedcourses.forEach(({ prefix, number, name }) => {
            coreClasses[`${prefix} ${number}`] =
                studentObject!.classes[`${prefix} ${number}`]
        })
    } else if (
        gradedcourses.length <
        degreePlan.requirements.core.groups![0].countRequired!
    ) {
        gradedcourses.forEach(({ prefix, number, name }) => {
            coreClasses[`${prefix} ${number}`] =
                studentObject!.classes[`${prefix} ${number}`]
        })
        nongradedcourses.forEach(({ prefix, number, name }) => {
            coreClasses[`${prefix} ${number}`] =
                studentObject!.classes[`${prefix} ${number}`]
        })
    }

    //list out the core and elective courses

    const coreGPAtranscript = { ...studentObject, classes: coreClasses }
    const electiveGPAtranscript = {
        ...studentObject,
        classes: electiveClasses,
    }

    let coreString = ''
    Object.keys(coreClasses).forEach((key) => {
        coreString = coreString.concat(key, ' ')
    })
    let electiveString = ''
    Object.keys(electiveClasses).forEach((key) => {
        electiveString = electiveString.concat(key, ' ')
    })

    //make outstanding requirements
    const corePrediction = requiredGrades(
        coreGPAtranscript as TranscriptData,
        degreePlan.requirements.core.gpaRequired
    )
    const electivePrediction = requiredGrades(
        electiveGPAtranscript as TranscriptData,
        degreePlan.requirements.electives.gpaRequired
    )
    const overallPrediction = requiredGrades(
        studentObject as TranscriptData,
        3.0
    )

    // print out pre reqs to string actually write code to check after presentation
    let preReqString = ''
    degreePlan.requirements.prerequisites.classes!.forEach(
        ({ prefix, number }) => {
            preReqString = preReqString.concat(`${prefix} ${number} `)
        }
    )
    degreePlan.requirements.other.classes!.forEach(({ prefix, number }) => {
        preReqString = preReqString.concat(`${prefix} ${number} `)
    })

    return (
        <Container>
            <h1>Audit Report</h1>
            <div>
                <p>Name:{studentObject?.name}</p>
                <p>Plan: Master</p>
                <p>ID: {studentObject?.id} </p>
                <p>Major: {degreePlan.major}</p>
                <p>Track: {degreePlan.track}</p>
                <p>Core GPA: {getGPA(coreGPAtranscript as TranscriptData)}</p>
                <p>
                    Elective GPA:{' '}
                    {getGPA(electiveGPAtranscript as TranscriptData)}
                </p>
                <p>Combined GPA: {getGPA(studentObject as TranscriptData)}</p>
                <p>Core Courses: {coreString} </p>
                <p>Elective Courses: {electiveString}</p>
                <p>
                    Leveling Courses and Pre-requisites from Admission Letter:
                    {preReqString}
                </p>
                <p>Outstanding Requiremtents:</p>
                <p>
                    Core:{' '}
                    {requirments(
                        corePrediction,
                        degreePlan.requirements.core.gpaRequired!
                    )}
                </p>
                <p>
                    Elective:{' '}
                    {requirments(
                        electivePrediction,
                        degreePlan.requirements.electives.gpaRequired!
                    )}
                </p>
                <p>Overall: {requirments(overallPrediction, 3.0)}</p>
            </div>
        </Container>
    )
}

function requirments(prediction: PredictedGrades, requiredGPA: number) {
    if (prediction.classes.length === 0) {
        return 'Complete '
    } else if (prediction.avgGrade! < 2) {
        let classList = ''
        prediction.classes.forEach(({ prefix, course }) => {
            classList = classList.concat(`${prefix} ${course} `)
        })
        return `To maintain ${requiredGPA} GPA\n   Student Must Pass ${classList} `
    } else if (prediction.avgGrade! < 4) {
        let classList = ''
        prediction.classes.forEach(({ prefix, course }) => {
            classList = classList.concat(`${prefix} ${course} `)
        })
        return `To maintain ${requiredGPA} GPA\n   The Student needs a GPA >= ${prediction.avgGrade} in: ${classList} `
    } else {
        let classList = ''
        prediction.classes.forEach(({ prefix, course }) => {
            classList = classList.concat(`${prefix} ${course} `)
        })
        return `GPA is not Possible in ${classList}`
    }
}
