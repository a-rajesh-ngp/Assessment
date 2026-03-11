import { isBoolean, isNumber, isString } from "../utils/validation_helpers.js"


export default class AssignmentDomain {
    public readonly id: number
    public readonly lessonId: number
    public readonly title: string
    public readonly description: string
    public readonly isSubmissionAllowed: boolean
    public readonly submission: any
    public readonly submissions: any

    constructor(data: any, isInstructor: boolean) {
        this.id = isNumber(data.id, 'ASSIGNMENT ID')
        this.lessonId = isNumber(data.lessonId, 'LESSON ID')
        this.title = isString(data.title, 'TITLE')
        this.description = isString(data.description, 'DESCRIPTION')
        this.isSubmissionAllowed = isBoolean(data.isSubmissionAllowed, 'IS_SUBMISSION_ALLOWED')

        if (!isInstructor) {
            this.submission =
                data.submissions && data.submissions.length
                ? {
                    id: data.submissions[0].id,
                    status: data.submissions[0].status,
                    grade: data.submissions[0].grade
                        ? data.submissions[0].grade.score
                        : null,
                    }
                : null
        }
        this.submissions = data.submissions ?? null
    }

    toJSON() {
        return {
            id: this.id,
            lessonId: this.lessonId,
            title: this.title,
            description: this.description,
            isSubmissionAllowed: this.isSubmissionAllowed,
            submission: this.submission,
            submissions: this.submissions,
        }
    }

    
}