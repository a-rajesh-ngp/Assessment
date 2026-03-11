import vine from '@vinejs/vine'

export const createDiscussionValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(3),
        body: vine.string().trim().minLength(10),
        params: vine.object({
            courseId: vine.number()
        })
    })
)