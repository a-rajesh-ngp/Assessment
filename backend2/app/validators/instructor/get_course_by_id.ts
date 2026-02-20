import vine from '@vinejs/vine'

export const getCourseByIdValidator = vine.compile(
  vine.object({
    params: vine.object({
      courseId: vine.number(),
    }),
  })
)