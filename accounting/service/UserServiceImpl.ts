import UserService from "./UserService";
import NewUserDto from "../dto/NewUserDto";
import UserDto from "../dto/UserDto";
import {User} from "../model/User";
import jwt from 'jsonwebtoken'
import {encodeBase64} from "../utils/utilsForPassword";


export default class UserServiceImpl implements UserService {
    async register(newUserDto: NewUserDto): Promise<UserDto> {
        const user = await User.findOne({login: newUserDto.login});
        if (user) {
            throw new Error("Register error: User already exists");
        }
        const newUser = new User({
            ...newUserDto,
            login: newUserDto.login.toLowerCase(),
            password: Buffer.from(newUserDto.password).toString("base64")
        });
        const res = await newUser.save();
        return new UserDto(res.login, res.firstName, res.lastName, res.roles);
    }

    async addRole(login: string, role: string): Promise<UserDto> {
        const user = await User.findOne({login});
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.roles.includes(role.toLowerCase())) {
            user.roles.push(role.toLowerCase());
            await user.save();
        } else {
            throw new Error("Role is already set");
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async getUser(login: string): Promise<UserDto> {
        const user = await User.findOne({login});
        if (!user) {
            throw new Error("User not found");
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async removeRole(login: string, role: string): Promise<UserDto> {
        const user = await User.findOne({login: login.toLowerCase()});
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.roles.filter(r => r === role.toLowerCase()).length) {
            throw new Error('Role not found')
        }
        user.roles = user.roles.filter(r => r !== role.toLowerCase());
        await user.save();
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async removeUser(login: string): Promise<UserDto> {
        const user = await User.findOneAndDelete({login: login.toLowerCase()});
        if (!user) {
            throw new Error("User not found");
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async updateUser(login: string, firstName: string, lastName: string): Promise<UserDto> {
        const user = await User.findOneAndUpdate(
            {login: login.toLowerCase()},
            {firstName, lastName},
            {new: true}
        );
        if (!user) {
            throw new Error("User not found");
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async changePassword(login:string, oldPassword: string, newPassword: string): Promise<{ message: string }> {
        if(!oldPassword || !newPassword) {
            throw new Error('Password cannot be empty')
        }
        if(oldPassword === newPassword) {
            throw new Error('The passwords cannot be the same')
        }

        const newPass = Buffer.from(newPassword).toString('base64');
        const currentPass = Buffer.from(oldPassword).toString('base64');
        const res = await User.findOneAndUpdate({login: login, password: currentPass}, {password: newPass});
        if(!res) throw new Error('Incorrect current password.');
        return {message: "Password changed successfully"};
    }

    async getAllUsers(): Promise<Pick<UserDto, 'login' | 'roles'>[]> {
        return (await User.find()).map(u => ({
            login: u.login,
            roles: u.roles
        }));    }

    async login(login: string, password: string): Promise<string> {
        const user = await User.findOne({login: login});
        if (!user) throw new Error(`User with login ${login} not found`);
        if(user.password !== encodeBase64(password)) throw new Error(`Password not valid`);
        return jwt.sign({login: user.login, roles: user.roles} ,
            process.env.JWT_SECRET!+"",
            {expiresIn: process.env.EXPIRED_COUNT as any});
    }
}
