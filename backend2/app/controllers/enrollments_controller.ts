import { enrollInCourseValidator } from '#validators/enroll_in_course'
import type { HttpContext } from '@adonisjs/core/http'
import EnrollmentsRepository from '../repositories/enrollments_repository.js'

export default class EnrollmentsController {
    protected enrollmentsRepository= new EnrollmentsRepository()
    
    async enrollInCourse(ctx: HttpContext) {
        const validatedData = await ctx.request.validateUsing(enrollInCourseValidator)
        const res =await this.enrollmentsRepository.enrollInCourse(ctx, validatedData)
        return {
            status: 'success',
            message: "Enrolled in course successfully.",
            data: res
        };
    }
}