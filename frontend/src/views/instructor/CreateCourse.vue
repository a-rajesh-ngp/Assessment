<template>
  <v-container>
    <v-card max-width="600" class="mx-auto mt-16">
      <v-card-title>Create Course</v-card-title>

      <v-card-text>
        <v-text-field
          label="Course Title"
          v-model="form.title"
        />

        <v-textarea
          label="Description"
          v-model="form.description"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="primary"
          :loading="courseStore.loading"
          @click="submit"
        >
          Create Course
        </v-btn>
        
      </v-card-actions>
      <v-alert
        v-if="courseStore.error" 
        type="error"
        variant="tonal"
        class="mt-2"
        density="compact"
        >
            {{ courseStore.error }}
        </v-alert>
      
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useCourseStore } from '@/stores/instructor/courseStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const courseStore = useCourseStore()

const form = reactive({
  title: '',
  description: '',
})

const submit = async () => {
  try {
    const res = await courseStore.createCourse(form)
    router.push(`/instructor/courses/${res.data.id}`)
  } catch(err) {
    console.log(err)
  }
}
</script>