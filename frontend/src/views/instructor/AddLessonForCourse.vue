<template>
  <v-container>
    <v-card class="mb-6 mt-16 pb-4">
      <v-card-title>{{ course?.title }}</v-card-title>
      <v-card-subtitle>{{ course?.description }}</v-card-subtitle>
    </v-card>

    <v-card>
      <v-card-title class="d-flex justify-space-between">
        Lessons
        <v-btn color="primary" v-if="authStore.user.role==='instructor'" @click="dialog=true">Add Lesson</v-btn>
      </v-card-title>

      <v-divider />

      <v-progress-linear
        v-if="course && authStore.user.role!=='instructor' && course.isEnrolled"
        :model-value="course.progress"
        height="8"
        color="green"
      />
      <p v-if="course && authStore.user.role!=='instructor' && course.isEnrolled" class="ml-4 mt-2">{{ course.progress?? 0 }}% completed </p>

      <v-list v-if="course">
        <v-alert
          v-if="course.lessons.length===0"
          type="info"
          variant="tonal"
        >
        {{ authStore.user.role==="instructor"? "No lessons added yet. Click 'Add Lesson' to get started." : "No lessons available yet. Please check back later."}}
          
        </v-alert>
        <v-list-item
          v-for="lesson in course.lessons" :key="lesson.id"
          @click="openLesson(lesson)"
          class="cursor-pointer"
        >
          <template #prepend>
            <v-icon v-if="lesson.completed" color="green" density="compact">mdi-check-circle</v-icon>
            <v-checkbox
              v-else-if="authStore.user.role!=='instructor' && course.isEnrolled"
              class="mt-4"
              :model-value="lesson.completed"
              density="compact"
              @update:model-value="toggleLesson(lesson.id, $event)"
              @click.stop
            />
          </template>
          <template #append>
            <v-btn 
              v-if="authStore.user.role==='instructor' && lesson.assignments.length===0"
              size="small"
              variant="outlined"
              color="primary"
              @click.stop="openCreateAssignmentDialog(lesson)"
            >
              Add Assignment
            </v-btn>
            <v-btn
              v-else-if="lesson.assignments.length>0 && authStore.user.role==='instructor'"
              size="small"
              variant="outlined"
              color="primary"
              @click.stop="openViewAssignmentDialog(lesson)"
            >
              View Assignment
            </v-btn>
            <v-btn
              v-else-if="lesson.assignments.length>0 && authStore.user.role==='student' && course.isEnrolled && lesson.assignments[0].submission === null"
              size="small"
              variant="outlined"
              color="primary"
              @click.stop="openViewAssignmentDialog(lesson)"
            >
              View Assignment
            </v-btn>
            <v-chip
              v-else-if="lesson.assignments.length>0 && authStore.user.role==='student' && course.isEnrolled && lesson.assignments[0].submission !== null"
              :color="lesson.assignments[0].submission.grade !== null ? 'green' : 'primary'"
            >
              <template v-if="lesson.assignments[0].submission.grade !== null">
                Assignment Score: {{ lesson.assignments[0].submission.grade }}/100
              </template>

              <template v-else>
                Assignment Submitted
              </template>
            </v-chip>
          </template>
          <v-list-item-title>
            {{ lesson.order }}. {{ lesson.title }}
            
          </v-list-item-title>

          <v-list-item-subtitle class="ml-5">
              {{ lesson.type }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
    <br/>
    <div class="d-flex justify-end">
      <v-btn
        @click="openCreateDiscussionDialog"
        color="primary" prepend-icon="mdi-forum-plus">
        Start Discussion
      </v-btn>
    </div>

    <v-card class="mt-6">
      <v-card-title>Discussions</v-card-title>
      <v-divider />

      <v-alert
        v-if="!discussions.length"
        type="info"
        variant="tonal"
      >
        No discussions yet. Be the first to start one.
      </v-alert>

      <v-list>
        <v-list-item
          v-for="discussion in discussions"
          :key="discussion.id"
          class="cursor-pointer"
          @click="openDiscussionDialog(discussion)"
        >
          <v-list-item-title>
            {{ discussion.title }}
          </v-list-item-title>

          <v-list-item-subtitle>
            Started by {{ discussion.user.username }} 
          </v-list-item-subtitle>

          <template #append>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <Dialog
      :model-value="showDialogForCreateDiscussion"
      :max-width="500"
    >
      <template #title>
        Start a Discussion
      </template>
      <template #default>
        <v-form ref="formRefForCreateDiscussion" @submit.prevent="createDiscussion">

          <v-text-field
            v-model="formForCreateDiscussion.title"
            label="Title"
            :rules="[required]"
          />
          <v-textarea
            v-model="formForCreateDiscussion.body"
            label="Describe your question"
            :rules="[required]"
          />
          <div class="d-flex justify-end mt-4">
            <v-btn @click="closeCreateDiscussionDialog">
              Cancel
            </v-btn>
            <v-btn 
              color="primary"
              type="submit"
              :loading="courseStore.loading"
              class="ml-4"
            >
              Create
            </v-btn>
          </div>
        </v-form>
      </template>


    </Dialog>

    <Dialog
      :model-value="showDialogForCreateAssignment"
      :max-width="500"
    >
      <template #title>
        <span v-if="selectedLesson">
          Create Assignment for {{ selectedLesson.title }}
        </span>
      </template>

      <v-form v-if="selectedLesson" ref="assignmentFormRef" @submit.prevent="createAssignment()">
      <template #default>
        <v-text-field
            v-model="assignmentForm.title"
            label="Assignment Title"
            :rules="titleRules"
          />
        <v-textarea
          label="Description"
          v-model="assignmentForm.description"
          :rules="descriptionRules"
        />
      
        <div class="d-flex justify-end mt-4">
          <v-btn @click="closeCreateAssignmentDialog">
            Cancel
          </v-btn>

          <v-btn
            class="ml-4" 
            color="primary"
            type="submit"
            >
            Create
          </v-btn>
          </div>

          <v-alert
            v-if="assignmentStore.error" 
            type="error"
            variant="tonal"
            class="mt-2"
            density="compact"
            >
                {{ assignmentStore.error }}
        </v-alert>
      </template>
      </v-form>

    </Dialog>

    <Dialog
      :model-value="showDialogForViewAssignment"
      :max-width="500"
    >
      <template #title>
        <span v-if="selectedLesson">
          Assignment for {{ selectedLesson.title }}
        </span>
      </template>

      <template #default>
        <v-form ref="viewAssignmentFormRef" @submit.prevent="submitAssignment()">

        <div v-if="selectedLesson && selectedLesson.assignments.length">
          <p class="text-subtitle-1 font-weight-medium">
            Title:<br/>
            {{ selectedLesson.assignments[0].title }}
          </p>

          <p class="mt-2 text-body-2">
            Description:<br/>
            {{ selectedLesson.assignments[0].description }}
          </p>
          <br/>
          <v-file-input
            v-if="authStore.user.role!=='instructor' && course.isEnrolled"
            v-model="viewAssignmentForm.assignmentFile"
            label="Upload File"
            accept=".pdf"
            prepend-icon="mdi-file-pdf-box"
            variant="outlined"
            density="compact"
            :rules="[required]"
            clearable
          />
          
        </div>
      
        <div class="d-flex justify-end mt-4">
          <v-btn @click="closeViewAssignmentDialog">
            Close
          </v-btn>
          <v-btn
            v-if="authStore.user.role==='student'"
            class="ml-4"
            color="primary"
            type="submit"
            :loading="assignmentStore.loading"
          >
            Submit Assignment
          </v-btn>
        </div>

        <v-alert
          v-if="assignmentStore.error" 
          type="error"
          variant="tonal"
          class="mt-2"
          density="compact"
          >
              {{ assignmentStore.error }}
        </v-alert>
        </v-form>
      </template>

    </Dialog>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Add Lesson</v-card-title>

        <v-card-text>
          <v-form ref="lessonFormRef" @submit.prevent="addLesson">
          <v-text-field
            v-model="lessonForm.title"
            label="Lesson Title"
            :rules="titleRules"
          />

          <v-select
            v-model="lessonForm.type"
            :items="['video', 'text', 'coding']"
            :rules="[required]"
            label="Lesson Type"
          />
          <v-file-input
            v-if="lessonForm.type==='video'"
            v-model="lessonForm.video"
            label="Upload video"
            accept="video/mp4,video/mov,video/mkv"
            prepend-icon="mdi-video"
            variant="outlined"
            :rules="videoRules"
          />
          <!-- <v-textarea
            v-else
            v-model="lessonForm.content"
            label="Lesson Content"
            :rules="contentRules"
            rows="4"
          /> -->
          <QuillEditor
            v-else
            v-model:content="lessonForm.content"
            contentType="html"
            theme="snow"
          />

            <v-spacer/>
            
            <v-btn text @click="dialog = false" class="mr-4">Cancel</v-btn>

            <v-btn type="submit" color="primary">
              Create
            </v-btn>

          </v-form>
        </v-card-text>

      </v-card>
    </v-dialog>

    <v-dialog v-model="selectedLessonDialog" max-width="800">
      <v-card v-if="selectedLesson">
        <v-card-title>{{ selectedLesson.title }}</v-card-title>

        <v-card-text>
          
          <video
            v-if="selectedLesson.type==='video'"
            controls 
            preload="metadata"
            style="width: 100%; max-height: 450px;"
          >
            <source
              :src="getVideoUrl(selectedLesson.content)"
              type="video/mp4"
            />
          </video>

          <div v-else-if="selectedLesson.type==='text'">
            <div class="lesson-content" v-html="selectedLesson.content"></div>
          </div>

          <div v-else-if="selectedLesson.type==='coding'">
            <pre class="code-block">{{ selectedLesson.content }}</pre>
          </div>

          
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="selectedLessonDialog=false">Close</v-btn>
        </v-card-actions>
        
      </v-card>
    </v-dialog>

    <Dialog
      :model-value="showAssignmentSubmissionsDialogForInstructor"
      :max-width=900
    >
      <template #title>
        <span v-if="selectedAssignment">
          Assignment Submissions for {{ selectedLesson.title }}
        </span>
      </template>

      <template #default>
        <v-container v-if="selectedAssignment">
          <p class="text-body-2 mb-4">
            {{ selectedAssignment.description }}
          </p>
          <v-divider class="mb-4" />
          <v-alert
            v-if="!selectedAssignment.submissions.length"
            type="info"
            variant="tonal"
          >
            No submissions yet
          </v-alert>

          <v-row 
            v-for="submission in selectedAssignment.submissions" :key="submission.id"
            class="mb-6"
          >
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-subtitle-1 d-flex align-center justify-space-between"  >
                  <div>
                  {{ submission.student.username }}
                  <span class="text-caption text-grey align-left">
                    ({{ submission.student.email }})
                  </span>
                  </div>
                  
                    <v-btn
                      color="primary"
                      :href="getAssignmentFileUrl(submission.file.path)"
                      target="_blank"
                      variant="outlined"
                      class="justify-end"
                    >
                      Open in new tab
                    </v-btn>
                </v-card-title>

                <v-card-text >
                  <iframe 
                    :src="getAssignmentFileUrl(submission.file.path)"
                    width="100%"
                    height="400"
                    style="border: none"
                  >
                  </iframe>

                  <div class="d-flex justify-end">
                    <v-form ref="formRefForGradeSubmission" @submit.prevent="submitGradeForAssignmentSubmission(submission)">
                    <v-text-field
                      max-width="200"
                      v-if="submission.grade===null"
                      v-model.number="submission.score"
                      variant="outlined"
                      type="number"
                      label="score"
                      min="0"
                      max="100"
                      class="mt-2"
                      :rules="scoreRules"
                    />
                    <v-alert
                      v-if="assignmentStore.error" 
                      type="error"
                      variant="tonal"
                      class="mb-2"
                      density="compact"
                      >
                          {{ assignmentStore.error }}
                    </v-alert>
                    <v-btn
                      class=""
                      v-if="submission.grade===null"
                      color="primary"
                      :loading="assignmentStore.loading"
                      :disabled="assignmentStore.loading"
                      type="submit"
                    >
                      Submit Grade
                    </v-btn>
                    
                    <div  v-else class="d-flex justify-end mt-2">
                    <v-chip
                      color="green"
                    >
                      Graded: {{ submission.grade.score }}
                    </v-chip>
                    </div>
                    </v-form>
                  </div>

                  
                </v-card-text>
              </v-card>
            </v-col>

          </v-row>

          <div class="d-flex justify-end">
            <v-btn @click="closeInstructorSubmissionsDialog">
              Close
            </v-btn>
          </div>
        </v-container>
      </template>

    </Dialog>

    <Dialog
      :model-value="showDiscussionDialog"
      :max-width="800"
    >
      <template #title>
        <div class="discussion-dialog-title" >
          <span>{{ selectedDiscussion?.title }}</span>

          <v-btn
            icon
            variant="text"
            color="error"
            @click="showDiscussionDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        
      </template>

      <template #default>
        <div class="discussion-body">
        <v-container v-if="selectedDiscussion">
          
          <!-- Discussion body -->
          <p class="mb-4">
            {{ selectedDiscussion.body }}
          </p>

          <v-divider class="mb-4" />

          <!-- Replies -->
          <v-alert
            v-if="!selectedDiscussion.replies.length"
            type="info"
            variant="tonal"
          >
            No replies yet
          </v-alert>
          <p v-else>Replies</p><br/>

          <v-card
            v-for="reply in selectedDiscussion.replies"
            :key="reply.id"
            class="mb-3"
          >
            <v-card-title class="text-subtitle-2">
              {{ reply.user.username }}
            </v-card-title>
            <v-card-text>
              {{ reply.body }}
            </v-card-text>
          </v-card>

          <!-- Reply form -->
          <v-divider class="my-4" />

          <v-form
            ref="formRefReply"
            @submit.prevent="submitReplyForDiscussion"
          >
            <v-textarea
              v-model="formReply.body"
              label="Write a reply"
              rows="3"
              auto-grow
              :rules="[required]"
            />

            <div class="d-flex justify-end mt-2">
              <v-btn
                color="primary"
                type="submit"
                :loading="courseStore.loading"
              >
                Reply
              </v-btn>
            </div>
          </v-form>

        </v-container>
        </div>
      </template>
    </Dialog>
  </v-container>
</template>


<script setup >
import Dialog from '@/components/Dialog.vue'
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/instructor/courseStore'
import { useAuthStore } from '@/stores/authStore'
import { setLessonAsCompleted } from '@/services/enrollmentService'
import { useAssignmentStore } from '@/stores/assignmentStore'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const assignmentStore = useAssignmentStore()
const courseStore = useCourseStore()
const authStore = useAuthStore()
const showDialogForCreateAssignment = ref(false)
const showDialogForViewAssignment = ref(false)
const route = useRoute()
const courseId = route.params.courseId
const showAssignmentSubmissionsDialogForInstructor = ref(false)
const selectedAssignment = ref(null)
const showDialogForCreateDiscussion = ref(false)
const formRefForCreateDiscussion = ref()
const formForCreateDiscussion = reactive({
  title: '',
  body: ''
})
const discussions = ref([])
const showDiscussionDialog = ref(false)
const selectedDiscussion = ref()
const formRefReply = ref()
const formReply = reactive({
  body: ''
})

const course = ref(null)
const lessonFormRef = ref()
const selectedLesson = ref(null)
const selectedLessonDialog = ref(false)
const dialog = ref(false)
const assignmentFormRef = ref()
const viewAssignmentFormRef = ref()
const viewAssignmentForm = reactive({
  assignmentFile: null
})
const assignmentForm = reactive({
  title: '',
  description: ''
})

const required = v => !!v || 'This field is required'

const scoreRules = [
  required,
  v=> (v>0 && v<100) || 'Score must be between 0 and 100'
]

const titleRules = [
  required,
  v => v.length >= 3 || 'Title must be at least 3 characters',
]

const descriptionRules = [
  required,
  v => v.length >= 10 || 'Description must be at least 10 characters',
]

const contentRules = [
  required,
  v => v.length >= 10 || 'Content must be at least 10 characters',
]

const videoRules = [
  v => !!v || 'Video file is required',
]

let lessonForm = reactive({
  title: '',
  type: 'text',
  content: '',
  video: null
})

const paragraphs = computed(() => {
  return selectedLesson.value.content.split('\n\n')
})

const getAssignmentFileUrl = (path) => {
  return `${import.meta.env.VITE_BACKEND_API_BASE_URL}uploads/${path}`
}

const submitGradeForAssignmentSubmission = async(submission) => {
  console.log(submission.score)
  
  if(!submission.score || (submission.score <0 || submission.score >100)) return
  
  try {
    await assignmentStore.submitGradeForAssignment(submission.id, {
      score: submission.score
    })

    submission.grade = submission.score
    submission.status= 'graded'
  } catch(err) {

  }

}

function openCreateAssignmentDialog(lesson) {
  showDialogForCreateAssignment.value = true
  selectedLesson.value = lesson
}

function openCreateDiscussionDialog() {
  showDialogForCreateDiscussion.value = true
}

function closeInstructorSubmissionsDialog() {
  showAssignmentSubmissionsDialogForInstructor.value = false
  selectedAssignment.value = null
  selectedLesson.value = null
}

function closeCreateDiscussionDialog() {
  showDialogForCreateDiscussion.value = false
  formForCreateDiscussion.title = ''
  formForCreateDiscussion.body = ''

}

const submitReplyForDiscussion = async () => {
  const { valid } = await formRefReply.value.validate()
  if (!valid) return

  try {
    const res = await courseStore.createReplyForDiscussion(
      courseId,
      selectedDiscussion.value.id,
      { body: formReply.body }
    )

    formReply.body = ''
    openDiscussionDialog(selectedDiscussion.value)

  } catch (err) {
    console.error(err)
  }
}


const createDiscussion = async() => {
  const {valid} = await formRefForCreateDiscussion.value.validate()
  if(!valid) return

  await courseStore.createDiscussion(courseId, {
    title: formForCreateDiscussion.title,
    body: formForCreateDiscussion.body
  })
  closeCreateDiscussionDialog()

}

function openViewAssignmentDialog(lesson) {
  selectedLesson.value = lesson
  if(authStore.user.role==='instructor') {
    selectedAssignment.value = lesson.assignments[0]
    showAssignmentSubmissionsDialogForInstructor.value = true
  } else {
    showDialogForViewAssignment.value = true
  }
}

const createAssignment = async() => {
  const {valid} = await assignmentFormRef.value.validate()
  if(!valid) return

  const payload = {
    ...assignmentForm,
    isSubmissionAllowed: true
  }
  try {
    await assignmentStore.createAssignment(selectedLesson.value.id, payload)
    showDialogForCreateAssignment.value = false
    selectedLesson.value = null
    assignmentForm.title=''
    assignmentForm.description=''
    await fetchCourse()
  } catch(err) {
    console.log(err)
  }
}

const submitAssignment = async() => {
  const {valid} = await viewAssignmentFormRef.value.validate()
  if(!valid) return

  try {

    const formData = new FormData()
    formData.append('assignmentFile', viewAssignmentForm.assignmentFile)

    await assignmentStore.submitAssignment(selectedLesson.value.assignments[0].id, formData)
    viewAssignmentForm.assignmentFile = null
    showDialogForViewAssignment.value = false
    selectedLesson.value = null
    await fetchCourse()

  } catch(err) {
    console.log(err)
  }
}

function closeCreateAssignmentDialog() {
  showDialogForCreateAssignment.value = false
  selectedLesson.value = null
}

function closeViewAssignmentDialog() {
  showDialogForViewAssignment.value = false
  selectedLesson.value = null
}

const fetchCourse = async () => {
  const res = await courseStore.fetchCourse(courseId)
  console.log(res)
  course.value = res.data
  recalculateProgress()
}



const addLesson = async () => {
  const { valid } = await lessonFormRef.value.validate()
  if (!valid) return

  const formData = new FormData()

  formData.append('title', lessonForm.title)
  formData.append('type', lessonForm.type)

  if(lessonForm.type==='video' && lessonForm.video) {
    formData.append('video', lessonForm.video)
  } else {
    formData.append('content', lessonForm.content)
  }

  await courseStore.addLesson(courseId, formData)
  dialog.value = false

  lessonForm.title =''
  lessonForm.content=''
  lessonForm.type='video'
  lessonForm.video=null
  alert('lesson added successfully')
  fetchCourse()
}

onMounted(async () => {
  await fetchCourse()
  await fetchDiscussions()
})

const fetchDiscussions = async() => {
  const res = await courseStore.fetchDiscussions(courseId)
  discussions.value = res.data
}

const openDiscussionDialog = async(discussion) => {
  const res = await courseStore.fetchDiscussionById(courseId, discussion.id)
  selectedDiscussion.value = res.data
  showDiscussionDialog.value = true
}

const openLesson=(lesson) => {
  console.log('Lesson:', lesson)
  console.log('Video path:', lesson.content)
  selectedLesson.value = lesson
  selectedLessonDialog.value = true
}

const getVideoUrl = (path) => {
  return `${import.meta.env.VITE_BACKEND_API_BASE_URL}uploads/${path}`
}

const toggleLesson = async(lessonId, completed) => {

  await setLessonAsCompleted(lessonId)

  const lesson = course.value.lessons.find(l => l.id === lessonId)
  if(lesson) {
    lesson.completed = true
  }
  recalculateProgress()
}

const recalculateProgress = () => {
  if (!course.value || !course.value.lessons?.length) return

  const total = course.value.lessons.length
  const completed = course.value.lessons.filter(l => l.completed).length

  course.value.progress = Math.round((completed / total) * 100)
}



</script>


<style scoped>
.discussion-body {
  max-height: 70vh;
  overflow-y: auto;
}
.discussion-dialog-title {
  position: sticky;
  top: 0;
  /* z-index: 20; */

  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
}
.lesson-content {
  line-height: 1.8;
  font-size: 16px;
}

.lesson-content h1,
.lesson-content h2,
.lesson-content h3 {
  margin-top: 20px;
}

.lesson-content p {
  margin-bottom: 12px;
}

.lesson-content ul {
  margin-left: 20px;
}
</style>

