import vine from '@vinejs/vine'

export const getDiscussionByIdValidator = vine.compile(
    vine.object({
        params: vine.object({
            courseId: vine.number(),
            discussionId: vine.number()
        })
    })
)