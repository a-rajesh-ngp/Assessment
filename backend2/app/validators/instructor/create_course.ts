import vine from '@vinejs/vine'

export const createCourseValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(3),
        description: vine.string().trim().minLength(10)
    })
)