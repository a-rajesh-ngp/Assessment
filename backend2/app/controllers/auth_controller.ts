import type { HttpContext } from '@adonisjs/core/http';
import AuthRepository from '../repositories/auth_repository.js';
import { loginValidator, LoginValidatorPayload } from '#validators/login';
import { inject } from '@adonisjs/core';

@inject()
export default class AuthController {

    constructor(protected authRepository: AuthRepository) {}

    async login({request, response} : HttpContext) {

        const validatedData: LoginValidatorPayload = await request.validateUsing(loginValidator);
        return this.authRepository.login(response, validatedData.email, validatedData.password);
        
    }
}