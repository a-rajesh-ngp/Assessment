import { createCourseValidator } from '#validators/instructor/create_course'
import type { HttpContext } from '@adonisjs/core/http'
import CoursesRepository from '../../repositories/instructor/courses_respository.js'

import { addLessonInCourseValidator } from '#validators/instructor/add_lesson_in_course'
import { getCourseByIdValidator } from '#validators/instructor/get_course_by_id'
import { inject } from '@adonisjs/core'
import { createDiscussionValidator } from '#validators/create_discussion'
import { getDiscussionsPerCourseValidator } from '#validators/get_discussion_per_course'
import { createReplyForDiscussionValidator } from '#validators/create_reply_for_discussion'
import { getDiscussionByIdValidator } from '#validators/get_discussion_by_id'
import { getCoursesValidator } from '#validators/get_course'

@inject()
export default class CoursesController {

    constructor(protected coursesRepository: CoursesRepository) {}
    
    
    async createCourse({user, request} : HttpContext) {
        const validatedData = await request.validateUsing(createCourseValidator)

        const res = await this.coursesRepository.createCourse(user?.id, validatedData)
        return {
            status: 'success',
            message: "Created course successfully.",
            data: res
        };
    }

    async addLessonInCourse({request, response, user}: HttpContext) {
        const validatedData = await request.validateUsing(addLessonInCourseValidator, {data: {...request.all(), params: request.params(), video: request.file('video')}})
        const res = await this.coursesRepository.addLessonInCourse( request, response, user, validatedData)
        return {
            status: 'success',
            message: "Created lesson successfully.",
            data: res
        }
    }

    async getCourseDetailsById({user,request}: HttpContext) {
        const validatedData = await request.validateUsing(getCourseByIdValidator)
        const res = await this.coursesRepository.getCourseDetailsById(user, validatedData)
        return {
            status: 'success',
            data: res
        };
    }

    async getInstructorCourses({user, request}: HttpContext) {
        const validatedData = await request.validateUsing(getCoursesValidator)
        const res =  await this.coursesRepository.getInstructorCourses(user, validatedData)
        return {
            status: 'success',
            data: res
        };
    }

    async getCourses({user, request, response}: HttpContext ) {
        const validatedData = await request.validateUsing(getCoursesValidator)
        const result= await this.coursesRepository.getAllCourses(user, response, validatedData)
        return {
            status: 'success',
            data: result
        };
    }

    async createDiscussion({user, request}: HttpContext) {
        const validatedData= await request.validateUsing(createDiscussionValidator)
        const res = await this.coursesRepository.createDiscussion(user, validatedData)

        return {
            status: 'success',
            data: res
        }
    }

    async getDiscussions({request}: HttpContext) {
        const validatedData = await request.validateUsing(getDiscussionsPerCourseValidator)
        const res = await this.coursesRepository.getDiscussions(validatedData)

        return {
            status: 'success',
            data: res
        }
    }

    async getDiscussionById({request}: HttpContext) {
        const validatedData = await request.validateUsing(getDiscussionByIdValidator)
        const res = await this.coursesRepository.getDiscussionById(validatedData)

        return {
            status: 'success',
            data: res
        }
    }

    async createReply({user, request}: HttpContext) {
        const validatedData = await request.validateUsing(createReplyForDiscussionValidator)
        const res = await this.coursesRepository.createReply(user, validatedData)
        return {
            status: 'success',
            data: res
        }
    }
    
}