import { createCourseValidator } from '#validators/instructor/create_course'
import type { HttpContext } from '@adonisjs/core/http'
import CoursesRepository from '../../repositories/instructor/courses_respository.js'

import { addLessonInCourseValidator } from '#validators/instructor/add_lesson_in_course'
import Lesson from '#models/lesson'
import { uploadVideoInLessonValidator } from '#validators/instructor/upload_video_in_lesson'
import { getCourseByIdValidator } from '#validators/instructor/get_course_by_id'

export default class CoursesController {
    protected coursesRepository = new CoursesRepository()

    async createCourse({user, request, response} : HttpContext) {
        if (user!.role !== 'instructor') {
            return response.status(403).send({
                status: 'error',
                message: 'only instructors can create courses'
            })
        }
        const validatedData = await request.validateUsing(createCourseValidator)

        return this.coursesRepository.createCourse(user?.id, validatedData)
    }

    async addLessonInCourse(ctx: HttpContext) {
        
        const validatedData = await ctx.request.validateUsing(addLessonInCourseValidator)
        return this.coursesRepository.addLessonInCourse( ctx, validatedData)
    }

    async getCourseDetailsById(ctx: HttpContext) {
        const validatedData = await ctx.request.validateUsing(getCourseByIdValidator)
        return this.coursesRepository.getCourseDetailsById(ctx, validatedData)
    }

    async getInstructorCourses(ctx: HttpContext) {
        return this.coursesRepository.getInstructorCourses(ctx)
    }

    async getCourses(ctx: HttpContext) {
        return this.coursesRepository.getAllCourses(ctx)
    }

}