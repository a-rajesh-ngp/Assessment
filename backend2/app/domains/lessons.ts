import { isNumber, isString } from "../utils/validation_helpers.js"
import AssignmentDomain from "./assignments.js"


export default class LessonsDomain {
    public readonly id: number
    public readonly courseId: number
    public readonly title: string
    public readonly type: string
    public readonly content: string
    public readonly order: number
    public readonly completed: boolean | null
    public readonly assignments: AssignmentDomain[] | null

    constructor(data: any, assignments?: AssignmentDomain[]) {
        console.log(data)
        this.id = isNumber(data.id, 'LESSON ID')
        this.courseId = isNumber(data.courseId, 'COURSE ID')
        this.title = isString(data.title, 'TITLE')
        this.type = isString(data.type, 'TYPE')
        this.content = isString(data.content, 'CONTENT')
        this.order = isNumber(data.order, 'ORDER')
        this.completed = !!data.completed
        this.assignments = assignments || null
    }

    toJSON() {
        return {
            id: this.id,
            courseId: this.courseId,
            title: this.title,
            type: this.type,
            content: this.content,
            order: this.order,
            completed: this.completed,
            assignments: this.assignments?.map((a)=> a.toJSON())
        }
    }

    static fromCollections(items: any[]) {
        return items.map((item)=> new LessonsDomain(item).toJSON())
    }

}