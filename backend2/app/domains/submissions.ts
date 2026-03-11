import { isNumber, isString } from "../utils/validation_helpers.js"


export default class SubmissionDomain {
    public readonly id: number
    public readonly assignmentId: number
    public readonly userId: number
    public readonly enrollmentId: number
    public readonly fileId: number | null
    public readonly status: string

    constructor(data: any) {
        this.id = isNumber(data.id, 'SUBMISSION ID')
        this.assignmentId = isNumber(data.assignmentId, 'ASSIGNMENT ID')
        this.userId = isNumber(data.userId, 'USER ID')
        this.enrollmentId = isNumber(data.enrollmentId, 'ENROLLMENT ID')
        this.fileId = isNumber(data.fileId, 'FILE ID')
        this.status = isString(data.status, 'STATUS')
    }

    toJSON() {
        return {
            id: this.id,
            assignmentId: this.assignmentId,
            userId: this.userId,
            enrollmentId: this.enrollmentId,
            fileId: this.fileId,
            status: this.status
        }
    }

    static fromCollections(items: any[]) {
        return items.map((item)=> new SubmissionDomain(item).toJSON())
    }
}