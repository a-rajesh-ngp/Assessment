import User from "#models/user";
import LoginDomain from "../domains/login_domain.js";
import { signJwt } from "../utils/jwt.js";
import { Exception } from '@adonisjs/core/exceptions'

export default class AuthRepository{
    protected loginDomain = new LoginDomain()

    async login(email: string, password: string) {
        const user: User = await User.findByOrFail('email', email);
        const isPasswordValid: Boolean = user.password===password;
        if (!isPasswordValid) {
            throw new Exception('Invalid credentials', {
                status: 401,
                code: 'E_INVALID_CREDENTIALS',
            })
        }
        
        const token: string = signJwt({userId: user.id, email: user.email, role: user.role});
        return this.loginDomain.login(token);
        
    }

}