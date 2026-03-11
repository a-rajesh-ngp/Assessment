import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
    vine.object({
        
        username: vine.string().trim().toLowerCase().regex(/^[a-z0-9_]+$/),
        email: vine.string().email()
            .unique({table:'users', column:'email'}),
        password: vine.string().trim().minLength(6),
        role: vine.enum(['student', 'instructor'])
    })
);