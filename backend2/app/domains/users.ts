import { isNumber, isString } from "../utils/validation_helpers.js"


export default class UsersDomain {
    public readonly id: number
    public readonly username: string
    public readonly email: string
    public readonly role: string

    constructor(data: any) {
        this.id = isNumber(data.id, 'USER ID')
        this.username = isString(data.username, 'USERNAME')
        this.email = isString(data.email, 'EMAIL')
        this.role = isString(data.role, 'ROLE')
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            role: this.role
        }
    }
}