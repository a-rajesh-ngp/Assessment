import vine from '@vinejs/vine'


export const addLessonInCourseValidator = vine.compile(
    vine.object({
        title: vine.string().minLength(2),
        type: vine.enum(['video', 'coding', 'text']),
        content: vine.string().optional(),
        params: vine.object({
            courseId: vine.number()
        })
    })
)