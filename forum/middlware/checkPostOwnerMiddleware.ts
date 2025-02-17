import {extendedReq} from "../../accounting/middlware/authenticationMiddlware";
import {Post as P} from "../models/Post";
import {checkRoles} from "../../accounting/utils/utilsForRoles";

export async function checkPostOwnerMiddleware(req: extendedReq, res: any, next: (err?: any) => any): Promise<any> {
    if (!req.user) next(new Error(`Not authenticated`))
    if (!req.params.id) next(new Error('Incorrect id'))
    const post = await P.findById(req.params.id)
    if (!post) return next(new Error(`Post not found`))
    if (req.user.login === post!.author) return next();
    if (req.method === "DELETE" && checkRoles(req.user, 'moderator')) return next();
    const action = req.method === "DELETE" ? "delete" : "update"
    return next(new Error(`Access denied. You can't ${action} this post`))
}