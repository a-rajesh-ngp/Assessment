import { createUserValidator } from '#validators/create_user';
import type { HttpContext } from '@adonisjs/core/http'
import UsersRepository from '../repositories/users_repository.js';

export default class UsersController {
    protected usersRepository = new UsersRepository()

    async createUser({request}: HttpContext) {
        const validatedData = await request.validateUsing(createUserValidator);
        const res = await this.usersRepository.createUser(validatedData);
        return {
            status: 'success',
            message: "Created a user successfully.",
            data: res
        };
    }
}