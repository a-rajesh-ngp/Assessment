<template>
  <v-container class="mt-16">
    <v-row v-if="courseStore.loading" justify="center">
      <v-progress-circular indeterminate/>
    </v-row>
    <v-row v-else-if="courseStore.error" justify="center">
      <v-col cols="12" md="6">
        <v-alert type="error">
          {{ courseStore.error }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-else-if="courses.length===0" justify="center">
      <v-col cols="12" md="6">
        <v-alert type="info">
          No courses available
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col
        v-for="course in courses" :key="course.id"
        cols="12"
        md="4"
      >
        <v-card
          class="hoverable"
        >
          <v-card-title>{{ course.title }}</v-card-title>
          <v-card-text>{{ course.description }}</v-card-text>


          <v-card-actions>
            <template v-if="authStore.user.role !== 'instructor'">
              <v-btn
                v-if="!course.enrolled"
                color="primary"
                @click.stop="enroll(course.id)"
              >
                Enroll
              </v-btn>
              <v-chip color="success" v-else class="ml-4">ENROLLED</v-chip>
            </template>
            <v-btn
              @click="goToCourse(course.id)"
              color="primary" variant="text">
              View Course
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-6" align="center" >
      <span class="mr-4">Page {{ page }} / {{ lastPage }}</span>
      <v-pagination
        v-model="page"
        :length="lastPage"
        :disabled="courseStore.loading"
      />
      <span class="ml-2 ">
        <v-select 
          v-model="limit"
          :items=[6,12,24]
          density="compact"
          variant="outlined"
        />
      </span>
    </v-row>
    

    
  </v-container>
</template>

<script setup>
import { enrollInCourse } from '@/services/enrollmentService'
import { useAuthStore } from '@/stores/authStore'
import { useCourseStore } from '@/stores/instructor/courseStore'
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const courseStore = useCourseStore()
const authStore = useAuthStore()
let courses = reactive([])
const page = ref(1)
const limit = ref(6)
const lastPage = ref(1)

watch(page, () => {
  fetchCourses()
})
watch(limit, () => {
  page.value = 1
  fetchCourses()
})

const fetchCourses = async () => {
    let res = null
    if(authStore.user.role==='instructor') {
      res = await courseStore.getCoursesByInstructor(page.value, limit.value)
    } else {
      res = await courseStore.getCourses(page.value, limit.value)
    }
    console.log(res)
    
    courses.length = 0
    courses.push(...res.data.data)
    lastPage.value = res.data.meta.lastPage
}

const goToCourse = (courseId) => {
  router.push(`/courses/${courseId}`)
}

const enroll = async (courseId) => {
  try {
    await enrollInCourse(courseId)
    await fetchCourses()
  } catch (error) {
    console.error(error.response?.data || error)
  }
}

onMounted(fetchCourses)

</script>