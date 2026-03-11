import api from "../http"

export const createCourseApi = (payload) => {
    return api.post('/instructor/createCourse', payload)
}

export const getCourseDetailsById = (courseId) => {
    return api.get(`/instructor/getCourseDetailsById/${courseId}`)
}

export const addLessonInCourse = (courseId,payload) => {
    return api.post(`/instructor/addLessonInCourse/${courseId}`, payload)
}

export const getAllCoursesByInstructor = (page, limit) => {
    return api.get('/instructor/coursesByInstructor', {
        params: {
            page, 
            limit
        }
    })
}

export const getAllCourses = (page, limit) => {
    return api.get("/courses", {
        params: {
            page, 
            limit
        }
    })
}

export const createDiscussionApi = (courseId, payload) => {
    return api.post(`/createDiscussionPerCourse/${courseId}`, payload)
}

export const getDiscussionsApi = (courseId) => {
    return api.get(`/getDiscussionsPerCourse/${courseId}`)
}

export const getDiscussionByIdApi = (courseId, discussionId) => {
    return api.get(`/discussionById/${courseId}/${discussionId}`)
}

export const createReplyForDiscussionApi = (courseId, discussionId, payload) => {
    return api.post(`/createReplyForDiscussion/${courseId}/${discussionId}`, payload)
}