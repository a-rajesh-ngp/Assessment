<template>
  <v-container>

    <v-card max-width="600" class="mx-auto mt-16">
      <v-card-title>Create Course</v-card-title>

      
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="submit">
    
        <v-text-field
          label="Course Title"
          v-model="form.title"
          :rules="titleRules"
        />

        <v-textarea
          label="Description"
          v-model="form.description"
          :rules="descriptionRules"
        />

        <v-btn
          color="primary"
          :loading="courseStore.loading"
          type="submit"
          class="mt-4"
        >
          Create Course
        </v-btn>

        </v-form>
      </v-card-text>

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

<script setup >
import { reactive, ref } from 'vue'
import { useCourseStore } from '@/stores/instructor/courseStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const courseStore = useCourseStore()
const formRef = ref()


const required = (v) => !!v || 'This field is required'

const titleRules = [
  required,
  v => v.length >= 3 || 'Title must be at least 3 characters',
]

const descriptionRules = [
  required,
  v => v.length >= 10 || 'Description must be at least 10 characters',
]

const form = reactive({
  title: '',
  description: '',
})

const submit = async () => {
  try {
    const {valid} = await formRef.value.validate()
    if (!valid) return
    const res = await courseStore.createCourse(form)
    alert('course created successfully')
    router.push(`/courses/${res.data.id}`)
  } catch(err) {
    console.log(err)
  }
}
</script>