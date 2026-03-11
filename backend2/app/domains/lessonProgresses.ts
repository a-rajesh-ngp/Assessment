import { isBoolean, isNumber } from "../utils/validation_helpers.js"


export default class LessonProgressDomain {
    public readonly id: number
    public readonly enrollmentId: number
    public readonly lessonId: number
    public readonly completed: boolean

    constructor(data: any) {
        this.id = isNumber(data.id, 'LESSON PROGRESS ID')
        this.enrollmentId = isNumber(data.enrollmentId, 'ENROLLMENT ID')
        this.lessonId = isNumber(data.lessonId, 'LESSON ID')
        this.completed = isBoolean(data.completed, 'COMPLETED')
    }

    toJSON() {
        return {
            id: this.id,
            enrollmentId: this.enrollmentId,
            lessonId: this.lessonId,
            completed: this.completed
        }
    }

    
} 