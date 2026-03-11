import vine from '@vinejs/vine'

export const getCoursesValidator = vine.compile(
    vine.object({
        page: vine.number().parse((p)=> p??1),
        limit: vine.number().parse((l)=> l??10)
    })
)