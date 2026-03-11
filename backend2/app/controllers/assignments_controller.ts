import { createAssignmentValidator } from '#validators/create_assignment'
import type { HttpContext } from '@adonisjs/core/http'
import AssignmentsRepository from '../repositories/assignments_repository.js'
import { inject } from '@adonisjs/core'
import { submitAssignmentValidator } from '#validators/submit_assignment'
import Submission from '#models/submission'
import { submitGradeForAssignment } from '#validators/submit_grade_for_assignment'

@inject()
export default class AssignmentsController {
    constructor(protected assignmentsRepository: AssignmentsRepository) {}

    public async createAssignment({user, request}: HttpContext) {
        const validatedData = await request.validateUsing(createAssignmentValidator)
        const res = await this.assignmentsRepository.createAssignment(user, validatedData)
        
        return {
            status: 'success',
            data: res
        }
    }

    public async submitAssignmentForLesson({user, request}: HttpContext) {
        const validatedData = await request.validateUsing(submitAssignmentValidator)
        const res = await this.assignmentsRepository.submitAssignmentForLesson(user, validatedData)
        
        return {
            status: 'success',
            data: res
        }
    }

    public async submitGradeForAssignment({user, request}: HttpContext) {
        const validatedData =  await request.validateUsing(submitGradeForAssignment)
        const res = await this.assignmentsRepository.submitGradeForAssignment(user, validatedData)
        return {
            status: 'success',
            data: 'Grade submitted successfully'
        }
    }

    

    
}