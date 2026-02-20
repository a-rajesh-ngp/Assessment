
import { addLessonInCourse, createCourseApi, getAllCourses, getAllCoursesByInstructor, getCourseDetailsById } from "@/services/instructor/courseService";
import { defineStore } from "pinia";
import { ref } from "vue";


export const useCourseStore = defineStore('course', () => {
    const loading = ref(false)
    const error = ref()
    
    async function createCourse(payload) {
        loading.value = true
        error.value = null
        try {
            const res = await createCourseApi(
                    {
                        'title': payload.title,
                        'description': payload.description
                    }
                )
            return res.data
        } catch(err) {
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    async function fetchCourse(courseId) {
        try { 
            loading.value = true
            const res = await getCourseDetailsById(courseId)
            return res.data
        } catch(err) {
            console.log(err)
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    async function addLesson(courseId, payload) {
        try {
            loading.value = true
            const res = await addLessonInCourse(courseId, 
                {
                    "title": payload.title,
                    "type": payload.type,
                    "content": payload.content
                }
            )
            return res.data
        } catch(err) {
            console.log(err)
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }   

    async function getCoursesByInstructor() {
        try { 
            loading.value = true
            const res = await getAllCoursesByInstructor()
            return res.data
        } catch(err) {
            console.log(err)
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    async function getCourses() {
        try { 
            loading.value = true
            const res = await getAllCourses()
            return res.data
        } catch(err) {
            console.log(err)
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        createCourse,
        fetchCourse,
        addLesson,
        getCoursesByInstructor,
        getCourses
    }
}) 