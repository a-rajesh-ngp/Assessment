<template>
  <v-container class="mt-16">
    <v-row>
      <v-col
        v-for="course in courses" :key="course.id"
        cols="12"
        md="4"
      >
        <v-card
          class="hoverable"
          @click="goToCourse(course.id)"
        >
          <v-card-title>{{ course.title }}</v-card-title>
          <v-card-text>{{ course.description }}</v-card-text>

          <v-card-actions>
            <v-btn color="primary" variant="text">
              View Course
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useCourseStore } from '@/stores/instructor/courseStore'
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const courseStore = useCourseStore()
const authStore = useAuthStore()
let courses = reactive([])


const fetchCourses = async () => {
    
    let res = null
    if(authStore.user.role=='instructor') {
      res = await courseStore.getCoursesByInstructor()
    } else {
      res = await courseStore.getCourses()
    }
    console.log(res)
    courses.splice(0, courses.length, ...res.data)
}

const goToCourse = (courseId) => {
  router.push(`/instructor/courses/${courseId}`)
}

onMounted(fetchCourses)
</script>