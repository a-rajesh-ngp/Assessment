import { createAssignmentApi, submitAssignmentApi, submitGradeForAssignmentApi } from "@/services/assignmentService";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAssignmentStore = defineStore('assignment', () => {

    const error = ref()
    const loading = ref(false)

    async function createAssignment(lessonId, payload) {
        try {
            loading.value = true
            return await createAssignmentApi(lessonId, payload)
        } catch(err) {
            const data = err.response?.data
            if(data?.errors?.length) {
                error.value = data.errors[0].message 
                console.log('error: ', this.error)
            } else {
                error.value = data?.message || 'Something went wrong. Try again sometime later.'
                console.log('error: ', this.error)
            }
        
            throw err
        } finally {
            loading.value = false
        }
    }

    async function submitAssignment(assignmentId, payload) {
        try {
            loading.value = true
            error.value = null
            return await submitAssignmentApi(assignmentId, payload)
        } catch(err) {
            const data = err.response?.data
            if(data?.errors?.length) {
                error.value = data.errors[0].message 
                console.log('error: ', this.error)
            } else {
                error.value = data?.message ||'Something went wrong. Try again sometime later.'
                console.log('error: ', data?.message)
            }
        
            throw err
        } finally {
            
            loading.value = false
        }
    }

    async function submitGradeForAssignment(submissionId, payload) {
        try {
            loading.value = true
            error.value = null
            const res = await submitGradeForAssignmentApi(submissionId, payload)
            return res
        } catch(err) {
            const data = err.response?.data
            if(data?.errors?.length) {
                error.value = data.errors[0].message 
                console.log('error: ', this.error)
            } else {
                error.value = data?.message ||'Something went wrong. Try again sometime later.'
                console.log('error: ', data?.message)
            }
            throw err
        } finally {
            
            loading.value = false
        }
    }

    return {
        error,
        loading,
        createAssignment,
        submitAssignment,
        submitGradeForAssignment
    }
})