import Assignment from "#models/assignment";
import Lesson from "#models/lesson";
import User from "#models/user";
import { Exception } from "@adonisjs/core/exceptions";
import { inject } from "@adonisjs/core";
import { MultipartFile } from "@adonisjs/core/types/bodyparser";
import Enrollment from "#models/enrollment";
import Submission from "#models/submission";
import File from "#models/file";
import Grade from "#models/grade";
import SubmissionDomain from "../domains/submissions.js";
import AssignmentDomain from "../domains/assignments.js";

@inject()
export default class AssignmentsRepository {
    
    async submitGradeForAssignment(user: User | undefined, validatedData: { params: { submissionId: number; }; score: number; }) {
        const submission = await Submission.query()
            .select(
                'submissions.id',
                'submissions.status',
                'assignments.id as assignmentId'
            )
            .join('assignments', 'assignments.id', 'submissions.assignment_id')
            .join('lessons', 'lessons.id', 'assignments.lesson_id')
            .join('courses', 'courses.id', 'lessons.course_id')
            .where('submissions.id', validatedData.params.submissionId)
            .where('courses.instructor_id', user!.id)
            .first()

        if(!submission) {
            throw new Exception('Submission not found or not authorized', {
                status: 404
            })
        }

        const existingGrade =  await Grade.query()
            .where('submissionId', submission.id)
            .first()
        if(existingGrade) {
            throw new Exception('Submission already graded', {
                status: 409
            })
        }

         await Grade.create({
            submissionId: submission.id,
            score: validatedData.score
        })
        await Submission.query()
            .where('id', submission.id)
            .update({status: 'graded'})

        return
        
    }


    async submitAssignmentForLesson(user: User | undefined, validatedData: { params: { assignmentId: number; }; assignmentFile: MultipartFile; }) {
        const assignment = await Assignment.query()
            .select(
                'assignments.id as assignmentId',
                'assignments.is_submission_allowed as isSubmissionAllowed',
                'lessons.course_id as courseId'
            )
            .join('lessons', 'lessons.id', 'assignments.lesson_id')
            .where('assignments.id', validatedData.params.assignmentId)
            .first()

        if(!assignment) {
            throw new Exception('Assignment not found', {
                status: 404,
            })
        }
        if(!assignment.$extras.isSubmissionAllowed) {
            throw new Exception('Submission is not allowed for this assignment', {
                status: 403,
            })
        }

        const enrollment = await Enrollment.query()
            .where('userId', user!.id)
            .where('courseId', assignment.$extras.courseId)
            .first()

        if (!enrollment) {
            throw new Exception('You are not enrolled in this course', {
                status: 403,
            })
        }

        const existingSubmission = await Submission.query()
            .where('assignmentId', assignment.$extras.assignmentId)
            .where('enrollmentId', enrollment.id)
            .first()

        if(existingSubmission) {
            throw new Exception('Assignment already submitted', {
                status: 409,
            })
        }
        const fileName = `${crypto.randomUUID()}.${validatedData.assignmentFile.extname}`
        const filePath = `assignments/${fileName}`
        await validatedData.assignmentFile.moveToDisk(filePath, 'fs')

        const savedFile = await File.create({
            fileName: validatedData.assignmentFile.clientName,
            path: filePath,
            disk: 'fs',
            mimeType: validatedData.assignmentFile.type,
            size: validatedData.assignmentFile.size,
            uploadedBy: user!.id
        })

        const submission = await Submission.create({
            assignmentId: assignment.$extras.assignmentId,
            userId: user!.id,
            enrollmentId: enrollment.id,
            fileId: savedFile.id,
            status: 'submitted'
        })

        return new SubmissionDomain(submission)

    }
    

    async createAssignment(user: User | undefined, validatedData: { title: string; description: string; isSubmissionAllowed: boolean; params: { lessonId: number; }; }) {
        const lesson = await Lesson.query()
            .join('courses', 'lessons.course_id', 'courses.id')
            .where('lessons.id', validatedData.params.lessonId)
            .select(
                'lessons.*',
                'courses.instructor_id as instructorId'
            )
            .firstOrFail()

        if(lesson.$extras.instructorId != user!.id) {
            throw new Exception('you are not allowed to create assignment for this lesson', {
                status: 403
            })
        }

        const existingAssignment = await Assignment.query()
            .where('lesson_id', lesson.id)
            .first()
        
        if (existingAssignment) {
            throw new Exception('Assignment already exists for this lesson', {
                status: 409,
            })
        }
        
        const assignment = await Assignment.create({
            lessonId: lesson.id,
            title: validatedData.title,
            description: validatedData.description,
            isSubmissionAllowed: validatedData.isSubmissionAllowed
        })

        return new AssignmentDomain(assignment, true).toJSON()
        

    }
}