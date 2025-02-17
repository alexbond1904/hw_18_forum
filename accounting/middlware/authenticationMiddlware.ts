import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

export type extendedReq = Request & { user: JwtPayload };

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return next(new Error("Not authenticated"));

    try {
        (req as Request & { user: JwtPayload }).user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        console.log("token" + (req as any).user)
        next();
    } catch {
        next(new Error("Not authenticated"));
    }
}

