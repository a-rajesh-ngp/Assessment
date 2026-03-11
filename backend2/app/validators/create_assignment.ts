import vine from '@vinejs/vine'

export const createAssignmentValidator = vine.compile(
    vine.object({
        title: vine.string().minLength(3),
        description: vine.string(),
        isSubmissionAllowed: vine.boolean(),
        params: vine.object({
            lessonId: vine.number(),
        }),
    })
)