import api from "./http"


export const setLessonAsCompleted = async(lessonId, payload) => {
    return api.post(`/lessons/${lessonId}/progressComplete`)
}

export const enrollInCourse = async(courseId) => {
    return api.post(`/courses/${courseId}/enroll`)
}