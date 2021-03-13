import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../helpers/environments";
import { UNAUTHORIZED } from "../helpers/json";

export type AuthVerified = {
    id: string;
    isRefreshToken: boolean;
};

export default {
    verify: (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization!!.split(" ")[1];
            const authVerified = jwt.verify(token, TOKEN_SECRET) as AuthVerified;

            if (authVerified.isRefreshToken) UNAUTHORIZED(res);
            else {
                req.authVerified = authVerified;
                next();
            }
        } catch (e: any) {
            UNAUTHORIZED(res);
        }
    },
    verifyForRefresh: (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization!!.split(" ")[1];
            const authVerified = jwt.verify(token, TOKEN_SECRET) as AuthVerified;

            if (!authVerified.isRefreshToken) UNAUTHORIZED(res);
            else {
                req.authVerified = authVerified;
                next();
            }
        } catch (e: any) {
            UNAUTHORIZED(res);
        }
    },
};
