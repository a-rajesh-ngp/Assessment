import type { HttpContext } from '@adonisjs/core/http';
import AuthRepository from '../repositories/auth_repository.js';
import { loginValidator, LoginValidatorPayload } from '#validators/login';

export default class AuthController {
    protected authRepository = new AuthRepository()

    async login({request} : HttpContext) {

        const validatedData: LoginValidatorPayload = await request.validateUsing(loginValidator);
        return this.authRepository.login(validatedData.email, validatedData.password);
        
    }
}