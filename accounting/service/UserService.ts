import NewUserDto from "../dto/NewUserDto";
import UserDto from "../dto/UserDto";

export default interface UserService {
    register(newUserDto: NewUserDto): Promise<UserDto>;
    removeUser(login: string): Promise<UserDto>;
    getUser(login: string): Promise<UserDto>;
    updateUser(login: string, firstName: string, lastName: string): Promise<UserDto>;
    addRole(login: string, role: string): Promise<UserDto>;
    removeRole(login: string, role: string): Promise<UserDto>;
    changePassword(login: string, oldPassword: string, newPassword: string): Promise<{ message: string }>;
    getAllUsers() : Promise<Pick<UserDto,'login' | 'roles'>[]>
    login(login: string, password: string): Promise<string>;
}