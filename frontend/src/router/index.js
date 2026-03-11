import { authGaurd } from '@/middlewares/authMiddleware'
import AddLessonForCourse from '@/views/instructor/AddLessonForCourse.vue'
import CreateCourse from '@/views/instructor/CreateCourse.vue'
import InstructorCourses from '@/views/instructor/InstructorCourses.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/signup',
      component: Signup,
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/instructor/createCourse',
      component: CreateCourse,
      meta: {requiresAuth: true}
    },
    {
      path: '/courses/:courseId',
      component: AddLessonForCourse,
      meta: {requiresAuth: true}
    },
    {
      path: '/viewCourses',
      component: InstructorCourses,
      meta: {requiresAuth: true}
    },
    
  ],
})

router.beforeEach(authGaurd)

export default router
