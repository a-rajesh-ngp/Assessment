import vine from '@vinejs/vine'

export const enrollInCourseValidator = vine.compile(
    vine.object({
        params: vine.object({
            courseId: vine.number()
        })
    })
)