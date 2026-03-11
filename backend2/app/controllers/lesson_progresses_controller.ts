import { lessonProgressCompleteValidator } from '#validators/lesson_progress_complete'
import type { HttpContext } from '@adonisjs/core/http'
import LessonProgressesRepository from '../repositories/lesson_progresses_repository.js'

export default class LessonProgressesController {
    protected lessonProgressesRepository = new LessonProgressesRepository()
    
    async progressComplete(ctx: HttpContext) {
        const validatedData = await ctx.request.validateUsing(lessonProgressCompleteValidator)
        const res = await this.lessonProgressesRepository.progressComplete(ctx, validatedData)
        return {
            status: 'success',
            data: res
        }
    }
}