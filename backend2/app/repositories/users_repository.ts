import User from "#models/user";
import UsersDomain from "../domains/users_domain.js";


export default class UsersRepository {
    protected usersDomain = new UsersDomain();

    async createUser(validatedData: { username: string; email: string; password: string; }) {
        const user: User = await User.create(validatedData);
        return this.usersDomain.createUsers(user)
    }
}