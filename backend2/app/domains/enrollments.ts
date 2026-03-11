import { isNumber } from "../utils/validation_helpers.js"


export default class EnrollmentDomain {
    public readonly id: number
    public readonly userId: number
    public readonly courseId: number

    constructor(data: any) {
        this.id = isNumber(data.id, 'ENROLLMENT ID')
        this.userId = isNumber(data.userId, 'USER ID')
        this.courseId = isNumber(data.courseId, 'COURSE ID')
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            courseId: this.courseId
        }
    }

    

}