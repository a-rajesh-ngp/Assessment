import Course from "#models/course";
import Enrollment from "#models/enrollment";
import { HttpContext } from "@adonisjs/core/http";
import EnrollmentDomain from "../domains/enrollments.js";


export default class EnrollmentsRepository {

    async enrollInCourse({user, response}: HttpContext, validatedData: { params: { courseId: number; }; }) {
        const courseId = validatedData.params.courseId

        await Course.findOrFail(courseId)

        const isEnrollmentAlreadyExists = await Enrollment.query()
            .where('userId', user!.id)
            .where('courseId', courseId)
            .first()

        if(isEnrollmentAlreadyExists) {
            return response.status(409).send({
                status: 'error',
                message: 'You have already enrolled in this course.'
            })
        }

        const enrollment = await Enrollment.create({
            userId: user?.id,
            courseId
        })

        return new EnrollmentDomain(enrollment).toJSON()

    }
}