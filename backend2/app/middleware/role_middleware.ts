import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, allowedRoles: string[]) {
    const user = ctx.user
    if(!user) {
      throw new Exception('Unauthenticated', {
        status: 401,
        code: 'E_UNAUTHENTICATED',
      })
    }

    if (!allowedRoles.includes(user.role)) {
      throw new Exception('You are not allowed to access this route', {
        status: 403,
        code: 'E_FORBIDDEN',
      })
    }

    const output = await next()
    return output
  }
}