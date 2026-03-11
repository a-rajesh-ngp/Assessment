import vine from '@vinejs/vine'

export const getDiscussionsPerCourseValidator = vine.compile(
    vine.object({
        params: vine.object({
            courseId: vine.number()
        })
    })
)