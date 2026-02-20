import User from "#models/user";


export default class UsersDomain {

    createUsers(user: User) {
        return {
            status: 'success',
            message: "Created a user successfully.",
            data: user
        };
    }
}