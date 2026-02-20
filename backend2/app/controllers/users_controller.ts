import { createUserValidator } from '#validators/create_user';
import type { HttpContext } from '@adonisjs/core/http'
import UsersRepository from '../repositories/users_repository.js';

export default class UsersController {
    protected usersRepository = new UsersRepository()

    async createUser({request}: HttpContext) {
        const validatedData = await request.validateUsing(createUserValidator);
        return this.usersRepository.createUser(validatedData);
    }
}