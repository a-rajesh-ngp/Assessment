import vine from '@vinejs/vine'

export const createCourseValidator = vine.compile(
    vine.object({
        title: vine.string().minLength(2),
        description: vine.string().minLength(10)
    })
)