import vine from '@vinejs/vine'

export const submitAssignmentValidator = vine.compile(
    vine.object({
        assignmentFile: vine.file({size:'50mb', extnames:['pdf']}),
        params: vine.object({
            assignmentId: vine.number()
        })
    })
)