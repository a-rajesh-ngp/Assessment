
import { addLessonInCourse, createCourseApi, createDiscussionApi, createReplyForDiscussionApi, getAllCourses, getAllCoursesByInstructor, getCourseDetailsById, getDiscussionByIdApi, getDiscussionsApi } from "@/services/instructor/courseService";
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

    async function fetchCourse(courseId) {
        try { 
            loading.value = true
            const res = await getCourseDetailsById(courseId)
            return res.data
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

    async function addLesson(courseId, payload) {
        try {
            loading.value = true
            const res = await addLessonInCourse(courseId, payload)
            return res.data
        } catch(err) {
            const data = err.response?.data
            if(data?.errors?.length) {
                error.value = data.errors[0].message 
                console.log('error: ', this.error)
            } else {
                error.value = data?.message || 'Something went wrong. Try again later.'
                console.log('error: ', this.error)
            }
            throw err
        } finally {
            loading.value = false
        }
    }

    async function getCoursesByInstructor(page, limit) {
        try {
            loading.value = true
            const res = await getAllCoursesByInstructor(page, limit)
            return res.data
        } catch(err) {
            const data = err.response?.data
            if(data?.errors?.length) {
                error.value = data.errors[0].message 
                console.log('error: ', this.error)
            } else {
                error.value = data?.message || 'Something went wrong. Try again later.'
                console.log('error: ', this.error)
            }
            throw err
        } finally {
            loading.value = false
        }
    }

    async function getCourses(page, limit) {
        try { 
            loading.value = true
            const res = await getAllCourses(page, limit)
            return res.data
        } catch(err) {
            const data = err.response?.data
            if(data.code==='E_DOMAIN_ERROR') {
                error.value = 'Something went wrong. Try again later.'
            }
            else if(data?.errors?.length) {
                error.value = data.errors[0].message 
                console.log('error: ', this.error)
            } else {
                error.value = data?.message || 'Something went wrong. Try again later.'
                console.log('error: ', this.error)
            }
            throw err
        } finally {
            loading.value = false
        }
    }

    async function createDiscussion(courseId, payload) {
        try {
            loading.value = true
            const res = await createDiscussionApi(courseId, payload)
            return res.data
        } catch(err) {
            const data = err.response?.data
            if(data?.errors?.length) {
                error.value = data.errors[0].message 
            } else {
                error.value = data?.message || 'Something went wrong. Try again later.'
            }
            console.log('error: ', this.error)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function fetchDiscussions(courseId) {
        try {
            loading.value = true
            const res = await getDiscussionsApi(courseId)
            return res.data
        } catch(err) {
            const data = err.response?.data
            if(data?.errors?.length) {
                error.value = data.errors[0].message 
            } else {
                error.value = data?.message || 'Something went wrong. Try again later.'
            }
            console.log('error: ', this.error)
            throw err
        } finally {
            loading.value = false
        }
        
    }

    async function fetchDiscussionById(courseId, discussionId) {
        try {
            loading.value = true
            const res = await getDiscussionByIdApi(courseId, discussionId)
            return res.data
        } catch(err) {
            const data = err.response?.data
            if(data?.errors?.length) {
                error.value = data.errors[0].message 
            } else {
                error.value = data?.message || 'Something went wrong. Try again later.'
            }
            console.log('error: ', this.error)
            throw err
        } finally {
            loading.value = false
        }


    }
    

    async function createReplyForDiscussion(courseId, discussionId, payload) {
        try {
            loading.value = true
            const res = await createReplyForDiscussionApi(courseId, discussionId, payload)
            return res.data
        } catch(err) {
            const data = err.response?.data
            if(data?.errors?.length) {
                error.value = data.errors[0].message 
            } else {
                error.value = data?.message || 'Something went wrong. Try again later.'
            }
            console.log('error: ', this.error)
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
        getCourses,
        createDiscussion,
        fetchDiscussions,
        fetchDiscussionById,
        createReplyForDiscussion
    }


})