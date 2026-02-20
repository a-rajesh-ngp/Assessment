import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { verifyJwt } from '../utils/jwt.js';
import User from '#models/user';

export default class JwtAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
      console.log('Entered JwtAuthMiddleware');
      const authHeader = ctx.request.header('authorization');

      if(!authHeader || !authHeader.startsWith('Bearer')) {
          return ctx.response.unauthorized('Missing or invalid token')
      }

      const token = authHeader.replace('Bearer ', '');

      const payload = verifyJwt(token) as {
        'userId': number
      };

      const user = await User.findBy('id', payload.userId);
      if(!user) {
        return ctx.response.unauthorized('User not found.')
      }

      ctx.user = user;
    
      
      const output = await next()
      return output
    
  }
}