import vine from '@vinejs/vine'

export const lessonProgressCompleteValidator = vine.compile(
    vine.object({
        params: vine.object({
            lessonId: vine.number()
        })
    })
)