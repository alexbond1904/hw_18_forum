import {extendedReq} from "./authenticationMiddlware";
import {checkRoles} from "../utils/utilsForRoles";

export function accountOwnerMiddleware(req: extendedReq, res: any, next: (err?: any) => any): any {
    if (!req.user) return next(new Error('Not authenticated'));
    if (req.user.login === req.params.login) return next();
    if (checkRoles(req.user, 'admin')) {
        if (req.method === 'PUT') next(new Error(`Not authorized. You can't update even if you are admin`));
        return next();
    }
    return next(new Error('Not authorized: You can only access your own account'));
}
