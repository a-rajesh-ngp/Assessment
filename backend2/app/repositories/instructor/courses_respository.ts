import Course from "#models/course";
import Lesson from "#models/lesson";
import Enrollment from "#models/enrollment";
import User from "#models/user";
import { Exception } from "@adonisjs/core/exceptions";
import { MultipartFile } from "@adonisjs/core/bodyparser";
import Discussion from "#models/discussion";
import DiscussionReply from "#models/discussion_reply";
import CoursesDomain2 from "../../domains/instructor/courses.js";
import LessonsDomain from "../../domains/lessons.js";
import AssignmentDomain from "../../domains/assignments.js";

export default class CoursesRepository {

    async getDiscussionById(validatedData: { params: { courseId: number; discussionId: number; }; }) {
        
        const discussion = await Discussion.query()
            .join('users', 'users.id', 'discussions.user_id')
            .where('discussions.id', validatedData.params.discussionId)
            .where('discussions.course_id', validatedData.params.courseId)
            .select(
                'discussions.id',
                'discussions.title',
                'discussions.body',
                'discussions.created_at',
                'users.id as user_id',
                'users.username as user_name',
                'users.email as user_email'
            )
            .first()

        if(!discussion) {
            throw new Exception('Discussion not found', {
                status: 404
            })
        }

        const replies = await DiscussionReply.query()
            .join('users', 'users.id', 'discussion_replies.user_id')
            .where('discussion_replies.discussion_id', validatedData.params.discussionId)
            .orderBy('discussion_replies.created_at', 'asc')
            .select(
                'discussion_replies.id',
                'discussion_replies.body',
                'discussion_replies.created_at',
                'users.id as user_id',
                'users.username as user_name',
                'users.email as user_email'
            )

        return {
            id: discussion.id,
            title: discussion.title,
            body: discussion.body,
            createdAt: discussion.createdAt,
            user: {
                id: discussion.$extras.user_id,
                username: discussion.$extras.username,
                email: discussion.$extras.user_email,
            },
            replies: replies.map((reply) => ({
                id: reply.id,
                body: reply.body,
                createdAt: reply.$extras.created_at,
                user: {
                    id: reply.$extras.user_id,
                    username: reply.$extras.user_name,
                    email: reply.$extras.user_email,
                },
            })),
        }

    }

    async createReply(user: User | undefined, validatedData: { params: { courseId: number; discussionId: number; }; body: string; }) {
        const discussion = await Discussion.query()
            .where('id', validatedData.params.discussionId)
            .where('courseId', validatedData.params.courseId)
            .first()

        if(!discussion) {
            throw new Exception('Discussion not found', { status: 404 })
        }

        const reply = await DiscussionReply.create({
            discussionId: discussion.id,
            userId: user?.id,
            body: validatedData.body
        })

        return reply

    }

    async getDiscussions(validatedData: { params: { courseId: number; }; }) {
        const discussions = await Discussion.query()
            .join('users', 'users.id', 'discussions.user_id')
            .where('courseId', validatedData.params.courseId)
            .select([
                'discussions.id',
                'discussions.title',
                'discussions.body',
                'discussions.created_at as createdAt',
                'users.id as userId',
                'users.username as username',
                'users.email as email',
            ])
            .orderBy('discussions.created_at', 'desc')

        return discussions.map((row) => ({
            id: row.id,
            title: row.title,
            body: row.body,
            createdAt: row.createdAt,
            user: {
                id: row.userId,
                username: row.$extras.username,
                email: row.$extras.email,
            },
        }))

    }
    
    async createDiscussion(user: User | undefined, validatedData: { title: string; params: { courseId: number; }; body: string; }) {
        const discussion = await Discussion.create({
            courseId: validatedData.params.courseId,
            userId: user!.id,
            title: validatedData.title,
            body: validatedData.body
        })
        return discussion
    }

    async createCourse(instructorId: number| undefined, validatedData: { title: string; description: string}) {
        const course: Course = await Course.create({...validatedData, instructorId: instructorId});
        return new CoursesDomain2(course)
    }

    async addLessonInCourse(request: any, response: any, user: User | undefined, validatedData: { title: string; type: "video" | "text" | "coding"; content?: string; video?: MultipartFile; params: { courseId: number; }; }) {
        
        const { params, title, type, content, video }= validatedData
        const course = await Course.findOrFail(params.courseId)

        if (course.instructorId !== user!.id) {
            throw new Exception('you are not allowed to add lesson in this course', {
                status: 403,
                code: 'E_FORBIDDEN',
            })
        }


        let finalContent: string
        if (type === 'video' && video) {

            const fileName = `${crypto.randomUUID()}.${video.extname}`
            const filePath = `videos/${fileName}`

            await video.moveToDisk(filePath, 'fs')
            finalContent = filePath
        } else {
            finalContent = content!
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

        return new LessonsDomain(lesson).toJSON()

    }


    async getCourseDetailsById(user: User | undefined, validatedData: { params: { courseId: number; }; }) {
        const isInstructor = user!.role === 'instructor'
        const courseId = validatedData.params.courseId
        const enrollment = await Enrollment.query()
            .where('userId', user!.id)
            .where('courseId', courseId)
            .first()

        const course = await Course.query()
            .where('id', courseId)
            .preload('lessons', (lessonQuery) => {
                lessonQuery
                    .orderBy('order', 'asc')
                    .preload('progress', (progressQuery)=> {
                        if(enrollment) {
                            progressQuery.where('enrollmentId', enrollment.id)
                        }
                    })
                    .preload('assignments', (assignmentQuery) => {
                        assignmentQuery.preload('submissions', (submissionQuery) => {
                            if(!isInstructor && enrollment) {
                                submissionQuery.where('enrollmentId', enrollment.id)
                            }
                            if(isInstructor) {
                                submissionQuery
                                    .preload('student', (userQuery) => {
                                        userQuery.select(['id', 'username', 'email'])
                                    })
                                    .preload('file', (fileQuery) => {
                                        fileQuery.select(['id', 'path', 'disk', 'mimeType'])
                                    })  
                            }
                            submissionQuery.preload('grade')
                        })
                    })
            })
            .firstOrFail()

        const lessonDomains = course.lessons.map((lesson)=> {
            const assignmentDomains = lesson.assignments.map((assignment) => {
                return new AssignmentDomain(assignment.serialize(), isInstructor)
            })

            return new LessonsDomain(
                {
                    ...lesson.toJSON(), 
                    completed: !!enrollment && lesson.progress.length > 0 && lesson.progress[0].completed
                },
                assignmentDomains
            )
        })

        const courseDomains = new CoursesDomain2(
            course.serialize(),
            lessonDomains,
            !!enrollment
        )

        return courseDomains.toJSON()

        const lessons = course.lessons.map((lesson) => {
            return {
                id: lesson.id,
                title: lesson.title,
                type: lesson.type,
                content: lesson.content,
                order: lesson.order,
                completed: !!enrollment && lesson.progress.length>0 && lesson.progress[0].completed ===true,
                assignments: lesson.assignments.map((assignment) => {
                    return {
                        id: assignment.id,
                        title: assignment.title,
                        description: assignment.description,
                        isSubmissionAllowed: assignment.isSubmissionAllowed,
                        createdAt: assignment.createdAt,
                        submission: !isInstructor? 
                            assignment.submissions.length? {
                            id: assignment.submissions[0].id,
                            status: assignment.submissions[0].status,
                            grade: assignment.submissions[0].grade
                                ? assignment.submissions[0].grade.score
                                : null,
                        } : null 
                        : undefined,
                        submissions: isInstructor? 
                            assignment.submissions.map((submission) => ({
                                id: submission.id,
                                status: submission.status,
                                file: submission.file? {
                                    id: submission.file.id,
                                    path: submission.file.path,
                                }: null,
                                student: {
                                    id: submission.student.id,
                                    name: submission.student.username,
                                    email: submission.student.email,
                                },
                                grade: submission.grade
                                ? submission.grade.score
                                : null,

                            })) : undefined,
                    }
                })
            }
        })

    }


    async getInstructorCourses(user: User | undefined, validatedData: { limit: number; page: number; }) {
        const paginator = await Course.query().where('instructorId', user!.id).paginate(validatedData.page, validatedData.limit)

        return {
            meta: paginator.getMeta(),
            data: CoursesDomain2.fromCollections(paginator.all())
        }
    }

    async getAllCourses(user: User | undefined, response: unknown, validatedData: { limit: number; page: number; }) {
        const paginator = await Course.query().paginate(validatedData.page, validatedData.limit)
        const enrollments = await Enrollment.query()
            .where('userId', user!.id)
            .select('courseId')
        const enrolledSet = new Set(enrollments.map(e => e.courseId))

        const courses =  paginator.all().map(course => 
            new CoursesDomain2({...course.toJSON(), enrolled: enrolledSet.has(course.id)}).toJSON()
        )
        return {
            meta: paginator.getMeta(),
            data: courses
        }
    }

    // async create

}





















