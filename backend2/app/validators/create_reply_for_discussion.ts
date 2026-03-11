import vine from '@vinejs/vine'

export const createReplyForDiscussionValidator = vine.compile(
    vine.object({
        body: vine.string().trim(),
        params: vine.object({
            courseId: vine.number(),
            discussionId: vine.number()
        })
    })
)