

export default class LoginDomain{
    login(token: string) {
        return {
            token,
            type: 'Bearer'
        }
    }

}