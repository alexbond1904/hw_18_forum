import {extendedReq} from "../../accounting/middlware/authenticationMiddlware";

export function checkAuthorMiddleware(req: extendedReq, res: any, next: (err?: any) => any): any {
    if(!req.user) return next(new Error(`Not authenticated`));
    if(req.user.login === req.params.author) return next();
    console.log(req.user.login+" "+req.params.author)
    return next(new Error(`You cannot publish on behalf of this author.`))

}