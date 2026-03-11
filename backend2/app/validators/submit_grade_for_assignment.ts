import vine from '@vinejs/vine'

export const submitGradeForAssignment = vine.compile(
    vine.object({
        score: vine.number().min(0).max(100),
        params: vine.object({
            submissionId: vine.number()
        })
    })
)