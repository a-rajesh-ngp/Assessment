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

export const getAllCoursesByInstructor = () => {
    return api.get('/instructor/coursesByInstructor')
}

export const getAllCourses = () => {
    return api.get("/courses")
}