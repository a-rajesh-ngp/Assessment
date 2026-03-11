import User from "#models/user";
import { signJwt } from "../services/jwt.js";
import { Exception } from '@adonisjs/core/exceptions'

export default class AuthRepository{

    async login(response: unknown, email: string, password: string) {
        const user: User = await User.findByOrFail('email', email);
        const isPasswordValid: Boolean = user.password===password;
        if (!isPasswordValid) {
            throw new Exception('Invalid credentials', {
                status: 401,
                code: 'E_INVALID_CREDENTIALS',
            })
        }
        
        const token: string = signJwt({userId: user.id, email: user.email, role: user.role});
        return {
            token,
            type: 'Bearer'
        }
    }
}