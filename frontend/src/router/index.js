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
      path: '/signup',
      component: Signup
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/instructor/createCourse',
      component: CreateCourse
    },
    {
      path: '/instructor/courses/:courseId',
      component: AddLessonForCourse
    },
    {
      path: '/instructor/viewCourses',
      component: InstructorCourses
    },
    
  ],
})

export default router
