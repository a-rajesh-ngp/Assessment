import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string()
    })
)

export type LoginValidatorPayload = Infer<typeof loginValidator>