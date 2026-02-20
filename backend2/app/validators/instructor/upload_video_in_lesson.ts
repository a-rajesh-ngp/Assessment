import vine from '@vinejs/vine'


export const uploadVideoInLessonValidator = vine.compile(
    vine.object({
        params: vine.object({
            lessonId: vine.number()
        })
    })
)