import { isBoolean, isNumber, isString } from "../../utils/validation_helpers.js"
import LessonsDomain from "../lessons.js"


export default class CoursesDomain2 {
    public readonly id: number
    public readonly title: string
    public readonly description: string
    public readonly instructorId: number
    public readonly enrolled: boolean | null
    public readonly isEnrolled: boolean | null
    public readonly lessons: LessonsDomain[] | null

    constructor(data: any, lessons?: LessonsDomain[], isEnrolled?: boolean) {
        this.id =  isNumber(data.id, 'COURSE ID')
        this.title = isString(data.title, 'TITLE')
        this.description = isString(data.description, 'DESCRIPTION')
        this.instructorId = isNumber(data.instructorId, 'INSTRUCTOR ID')
        this.enrolled = data.enrolled? isBoolean(data.enrolled, 'ENROLLED'): null
        this.isEnrolled = isEnrolled? isBoolean(isEnrolled, 'IS_ENROLLED'): null
        this.lessons = lessons || null
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            instructorId: this.instructorId,
            enrolled: this.enrolled,
            isEnrolled: this.isEnrolled,
            lessons: this.lessons?.map((l)=> l.toJSON())
        }
    }

    static fromCollections(items: any[]) {
        return items.map((item) => new CoursesDomain2(item).toJSON())
    }
}