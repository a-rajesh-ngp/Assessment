/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import CoursesController from '#controllers/instructor/courses_controller'
import EnrollmentsController from '#controllers/enrollments_controller'
import LessonProgressesController from '#controllers/lesson_progresses_controller'
import AssignmentsController from '#controllers/assignments_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/signup', [UsersController, 'createUser'])
router.post('/login', [AuthController, 'login'])


router.group(() => {
  router.post('/createCourse', [CoursesController, 'createCourse']).middleware([middleware.role(['instructor'])])
  router.post('/addLessonInCourse/:courseId', [CoursesController, 'addLessonInCourse']).middleware([middleware.role(['instructor'])])
  router.get('/getCourseDetailsById/:courseId', [CoursesController, 'getCourseDetailsById'])
  router.get('/coursesByInstructor', [CoursesController, "getInstructorCourses"]).middleware([middleware.role(['instructor'])])
  router.post('/lessons/:lessonId/createAssignmentPerLesson', [AssignmentsController, 'createAssignment']).middleware([middleware.role(['instructor'])])
  router.post('/assignments/submitGradeForAssignment/:submissionId', [AssignmentsController, 'submitGradeForAssignment']).middleware([middleware.role(['instructor'])])

}).prefix('/instructor').middleware([middleware.jwtAuth()])


router.group(() => {

  router.get('/courses', [CoursesController, 'getCourses'])
  router.post('/courses/:courseId/enroll', [EnrollmentsController, 'enrollInCourse'])
  router.post('/lessons/:lessonId/progressComplete', [LessonProgressesController, 'progressComplete'])
  router.post('/submitAssignmentForLesson/:assignmentId', [AssignmentsController, 'submitAssignmentForLesson'])

  // Discussions
  router.post('/createDiscussionPerCourse/:courseId', [CoursesController, 'createDiscussion'])
  router.get('/getDiscussionsPerCourse/:courseId', [CoursesController, 'getDiscussions'])
  router.get('/discussionById/:courseId/:discussionId', [CoursesController, 'getDiscussionById'])

  // Replies
  router.post('/createReplyForDiscussion/:courseId/:discussionId', [CoursesController, 'createReply'])

  
}).middleware(middleware.jwtAuth())
