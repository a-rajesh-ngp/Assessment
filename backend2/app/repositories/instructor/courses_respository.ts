import Course from "#models/course";
import Lesson from "#models/lesson";
import { HttpContext } from "@adonisjs/core/http";
import CoursesDomain from "../../domains/instructor/courses_domain.js";


export default class CoursesRepository {
    
    
    protected coursesDomain = new CoursesDomain();

    async createCourse(instructorId: number| undefined, validatedData: { title: string; description: string}) {
        const course: Course = await Course.create({...validatedData, instructorId: instructorId});
        return this.coursesDomain.createCourse(course)
    }

    async addLessonInCourse({request, response, user}: HttpContext, validatedData: { title: string; type: "video" | "text" | "coding"; content?: string; params: { courseId: number; }; }) {
        
        const { params, title, type, content }= validatedData
        const course = await Course.findOrFail(params.courseId)

        if (course.instructorId !== user!.id) {
            return response.status(403).send({
                status: 'error',
                message: 'you are not allowed to add lesson in this course'
            })
        }

        if ((type === 'text' || type === 'coding') && !content) {
            return response.status(403).send({
                status: 'error',
                message: 'Content is required for text or coding lessons',
            })
        }

        let finalContent: string
        if (type === 'video') {
            const video = request.file('video', {
                size: '500mb',
                extnames: ['mp4', 'mov', 'mkv'],
            })

            if (!video || !video.isValid) {
                return response.status(400).send({
                    status: 'error',
                    message: 'video file is not valid',
                })
            }

            const fileName = `${crypto.randomUUID()}.${video.extname}`
            const filePath = `videos/${fileName}`

            await video.moveToDisk(filePath, 'fs')
            finalContent = filePath
        }

        if (type === 'text' || type === 'coding') {
            if (!content) {
                return response.status(400).send({
                    status: 'error',
                    message: 'content is required for text or coding lessons',
                })
            }
            finalContent = content
        }


        const lastLesson = await Lesson.query()
                                    .where('courseId', params.courseId)
                                    .orderBy('order', 'desc')
                                    .first()

        const nextOrder = lastLesson ? lastLesson.order + 1 : 1
        const lesson = await Lesson.create({
            courseId: course.id,
            title,
            type,
            content: finalContent!,
            order: nextOrder
        })
        return this.coursesDomain.addLessonInCourse(lesson)
    }


    async getCourseDetailsById({user, response}: HttpContext, validatedData: { params: { courseId: number; }; }) {
        const course = await Course.query()
            .where('id', validatedData.params.courseId)
            .preload('lessons', (query) => {
                query.orderBy('order', 'asc')
            })
            .first()


        if (!course) {
            return response.status(404).send({
                status: 'error',
                message: 'Course not found',
            })
        }

        // if (course.instructorId !== user!.id) {
        //     return response.status(403).send({
        //         status: 'error',
        //         message: 'You are not allowed to access this course',
        //     })
        // }

        return this.coursesDomain.getCourseDetailsById(course)
    }


    async getInstructorCourses({user, response}: HttpContext) {
        const courses = await Course.query().where('instructorId', user!.id)
        
        return this.coursesDomain.getInstructorCourses(courses)
    }

    async getAllCourses({response} :HttpContext) {
        const courses = await Course.query().preload('lessons')
        return this.coursesDomain.getAllCourses(courses)
    }

}