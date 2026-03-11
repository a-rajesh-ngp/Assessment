import api from "./http";

export const createAssignmentApi = async(lessonId, payload) => {
    return api.post(`/instructor/lessons/${lessonId}/createAssignmentPerLesson`, payload)
} 

export const submitAssignmentApi = async(assignmentId, payload) => {
    return api.post(`/submitAssignmentForLesson/${assignmentId}`, payload)
}

export const submitGradeForAssignmentApi = async(submissionId, payload) => {
    return api.post(`/instructor/assignments/submitGradeForAssignment/${submissionId}`, payload)
}