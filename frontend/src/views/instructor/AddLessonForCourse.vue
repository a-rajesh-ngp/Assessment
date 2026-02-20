<template>
  <v-container>
    <v-card class="mb-6 mt-16 pb-4">
      <v-card-title>{{ course?.title }}</v-card-title>
      <v-card-subtitle>{{ course?.description }}</v-card-subtitle>
    </v-card>

    <v-card>
      <v-card-title class="d-flex justify-space-between">
        Lessons
        <v-btn color="primary" :disabled="authStore.user.role!=='instructor'" @click="dialog=true">Add Lesson</v-btn>
      </v-card-title>

      <v-divider />

      <v-list v-if="course">
        <v-list-item
          v-for="lesson in course.lessons"
          :key="lesson.id"
        >
          <v-list-item-title>
            {{ lesson.order }}. {{ lesson.title }}
          </v-list-item-title>

          <v-list-item-subtitle>
            Type: {{ lesson.type }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Add Lesson</v-card-title>

        <v-card-text>
          <v-text-field
            v-model="lessonForm.title"
            label="Lesson Title"
            required
          />

          <v-select
            v-model="lessonForm.type"
            :items="['video', 'text', 'coding']"
            label="Lesson Type"
          />
          <v-textarea
            v-if="lessonForm.type !== 'video'"
            v-model="lessonForm.content"
            label="Lesson Content"
            rows="4"
          />
          

        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="addLesson">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/instructor/courseStore'
import { useAuthStore } from '@/stores/authStore'

const courseStore = useCourseStore()
const authStore = useAuthStore()

const route = useRoute()
const courseId = route.params.courseId

const loading = ref(false)
const course = ref(null)

const dialog = ref(false)

let lessonForm = reactive({
  title: '',
  type: null,
  content: '',
})

const fetchCourse = async () => {
  const res = await courseStore.fetchCourse(courseId)
  console.log(res)
  course.value = res.data
}

const addLesson = async () => {
  await courseStore.addLesson(courseId, lessonForm)
  dialog.value = false
  lessonForm = reactive({ title: '', type: 'video', content: '' })
  fetchCourse()
}

onMounted(fetchCourse)
</script>