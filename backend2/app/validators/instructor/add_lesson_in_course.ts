import vine from '@vinejs/vine'


export const addLessonInCourseValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(2),
        type: vine.enum(['video', 'coding', 'text']),
        content: vine.string().trim().optional().requiredWhen('type', 'in', ['coding', 'text']),
        video: vine.file({size: '500mb', extnames: ['mp4','mov','mkv']}).optional().requiredWhen('type', 'in', ['video']),
        params: vine.object({
            courseId: vine.number()
        })
    })
)