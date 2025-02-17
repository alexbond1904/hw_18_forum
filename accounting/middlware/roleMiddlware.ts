import {Role} from "../model/Role";
import {extendedReq} from "./authenticationMiddlware";
import {checkRoles} from "../utils/utilsForRoles";

export function roleMiddleware(role: Role) {
    return function (req: extendedReq, res: any, next: (err?: any) => any): any {
        if(!req.user) return next(new Error(`Not authenticated`));
        if(checkRoles(req.user, role)) return next();
        return next(new Error(`Access denied. You can't do this action`))
    }
}