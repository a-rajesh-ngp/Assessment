import { Exception } from "@adonisjs/core/exceptions"

export function isString(value: any, variableName: string) {
    if(typeof value !== 'string') throw new Exception(`${variableName} must be a string in response`, {
        status: 500,
        code: 'E_DOMAIN_ERROR'
    })
    return value
}

export function isNumber(value: any, variableName: string) {
    if(typeof value !== 'number') throw new Exception(`${variableName} must be a number in response`, {
        status: 500,
        code: 'E_DOMAIN_ERROR'
    })
    return value
}

export function isBoolean(value: any, variableName: string) {
    if(typeof value !== 'boolean') throw new Exception(`${variableName} must be a boolean in response`, {
        status: 500,
        code: 'E_DOMAIN_ERROR'
    })
    return value
}