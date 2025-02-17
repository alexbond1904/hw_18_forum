import UserDto from "../dto/UserDto";
import {IUser} from "../model/User";
import {Role} from "../model/Role";
import {extendedReq} from "../middlware/authenticationMiddlware";

export function checkRoles (user: any, role: Role) {
    return user.roles.includes(role);
}