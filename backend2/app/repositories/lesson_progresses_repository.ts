import Enrollment from "#models/enrollment";
import Lesson from "#models/lesson";
import LessonProgress from "#models/lesson_progress";
import { HttpContext } from "@adonisjs/http-server";
import { DateTime } from "luxon";
import LessonProgressDomain from "../domains/lessonProgresses.js";


export default class LessonProgressesRepository {

    async progressComplete({user, response}: HttpContext, validatedData: { params: { lessonId: number; }; }) {
        const lessonId = validatedData.params.lessonId

        const lesson = await Lesson.findOrFail(lessonId)

        const enrollment = await Enrollment.query()
            .where('userId', user!.id)
            .where('courseId', lesson.courseId)
            .first()

        if(!enrollment) {
            return response.status(403).send({
                status: 'error',
                message: 'You are not enrolled in this course'
            })
        }

        const existingProgress = await LessonProgress.query()
            .where('enrollmentId', enrollment.id)
            .where('lessonId', lessonId)
            .first()

        if(existingProgress) {
            existingProgress.completed = true
            await existingProgress.save()
            return {
                status: 'success',
                data: existingProgress
            }
        }

        const progress = await LessonProgress.create({
            enrollmentId: enrollment.id,
            lessonId,
            completed: true,
            completedAt: DateTime.now()
        })

        return new LessonProgressDomain(progress).toJSON()
    }
}