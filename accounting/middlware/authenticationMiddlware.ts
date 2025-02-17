import { Request, Response, NextFunction } from "express";
import {IUser, User} from "../model/User";
import {decodeBase64, encodeBase64} from "../utils/utilsForPassword";
import UserDto from "../dto/UserDto";
import jwt, {JwtPayload} from "jsonwebtoken";

export type extendedReq = Request & { user: JwtPayload };

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return next(new Error("Not authenticated"));

    try {
        (req as Request & { user: JwtPayload }).user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        next();
    } catch {
        next(new Error("Not authenticated"));
    }
}

