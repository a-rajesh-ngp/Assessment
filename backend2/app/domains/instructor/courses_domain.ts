import Course from "#models/course";
import Lesson from "#models/lesson";


export default class CoursesDomain {
    getAllCourses(courses: Course[]) {
        return {
            status: 'success',
            data: courses
        };
    }
    getInstructorCourses(courses: Course[]) {
        return {
            status: 'success',
            data: courses
        };
    }
    getCourseDetailsById(course: Course) {
        return {
            status: 'success',
            data: course
        };
    }

    createCourse(course: Course) {
        return {
            status: 'success',
            message: "Created course successfully.",
            data: course
        };
    }

    addLessonInCourse(lesson: Lesson) {
        return {
            status: 'success',
            message: "Created lesson successfully.",
            data: lesson
        };
    }
}