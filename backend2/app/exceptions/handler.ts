import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
  */
 async handle(error: any, ctx: HttpContext) {
    logger.error({
      message: error.message,
      stack: error.stack,
      url: ctx.request.url,
      method: ctx.request.method
    });
    
    if (error.code === 'E_ROW_NOT_FOUND') {
      return ctx.response.status(404).json({
        status: 'error',
        message: 'Resource not found',
      })
    }

    if (error.code === 'E_UNAUTHENTICATED') {
      return ctx.response.status(401).json({
        status: 'error',
        message: error.message,
      })
    }

    if (error.code === 'E_FORBIDDEN') {
      return ctx.response.status(403).json({
        status: 'error',
        message: error.message,
      })
    }

    if (error.code === 'E_ROUTE_NOT_FOUND') {
      return ctx.response.status(404).json({
        status: 'error',
        message: 'The requested url does not exist'
      })
    }

    if (error.code === 'E_VALIDATION_ERROR') {
      return ctx.response.status(422).json({
        status: 'error',
        message: error.message || 'Validation failed',
        errors: error.messages,
      })
    } 
    if (error.code === 'E_NOT_FOUND') {
      return ctx.response.status(404).json({
        status: 'error',
        message: error.message,
      })
    }
    if (error.code === 'E_BAD_REQUEST') {
      return ctx.response.status(400).json({
        status: 'error',
        message: error.message,
      })
    } 
    if (error.name === 'TokenExpiredError') {
      return ctx.response.status(401).json({
        status: 'error',
        message: 'Access token expired',
        code: 'TOKEN_EXPIRED',
      })
    }
    if (error.name === 'JsonWebTokenError') {
      return ctx.response.status(401).json({
        status: 'error',
        message: 'Invalid access token',
        code: 'INVALID_TOKEN',
      })
    }
    if (error.code === 'ECONNREFUSED' || error.code === 'EREQUEST') {
        logger.error('DATABASE CONNECTION LOST')
        return ctx.response.status(503).send({
          status: 'error',
          message: 'Service temporarily unavailable (Database Error).',
        })
    }
    if(error.code ==='E_DOMAIN_ERROR') {
      return ctx.response.status(500).json({
        status: 'error',
        message: error.message,
        code: 'E_DOMAIN_ERROR',
      })
    }

    const statusCode = error.status || 500
    return ctx.response.status(statusCode).send({
      status: 'error',
      message: this.debug? error.message : 'An unexpected error occurred'
    })
    
    
    
    // return super.handle(error, ctx)
    
    
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}