import User from "#models/user";
import UsersDomain from "../domains/users.js";


export default class UsersRepository {

    async createUser(validatedData: { username: string; email: string; password: string; }) {
        const user: User = await User.create(validatedData);
        return new UsersDomain(user).toJSON()
    }
}