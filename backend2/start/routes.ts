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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/signup', [UsersController, 'createUser'])
router.post('/login', [AuthController, 'login'])


router.group(() => {
  router.post('/createCourse', [CoursesController, 'createCourse'])
  router.post('/addLessonInCourse/:courseId', [CoursesController, 'addLessonInCourse'])
  router.get('/getCourseDetailsById/:courseId', [CoursesController, 'getCourseDetailsById'])
  router.get('/coursesByInstructor', [CoursesController, "getInstructorCourses"])
  
}).prefix('/instructor').middleware([middleware.jwtAuth()])


router.get('/courses', [CoursesController, 'getCourses'])