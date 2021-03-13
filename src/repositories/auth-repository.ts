import { Request, Response } from "express";
import { decrypt } from "../helpers/encryption";
import { ERROR, OK, UNAUTHORIZED } from "../helpers/json";
import authSchema, { AuthDocument } from "../schemas/auth";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../helpers/environments";

export const refresh = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        const token = jwt.sign(
            {
                id: auth!!._id,
                level: auth!!.level,
                isRefreshToken: false,
            },
            TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            {
                id: auth!!._id,
                level: auth!!.level,
                isRefreshToken: true,
            },
            TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        OK(res, {
            auth: auth,
            token: token,
            refreshToken: refreshToken,
        });
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findOne({ [AuthDocument.username]: req.body.username });

        if (auth !== null && decrypt(auth.password!!) === req.body.password) {
            const token = jwt.sign(
                {
                    id: auth._id,
                    level: auth.level,
                    isRefreshToken: false,
                },
                TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            const refreshToken = jwt.sign(
                {
                    id: auth._id,
                    level: auth.level,
                    isRefreshToken: true,
                },
                TOKEN_SECRET,
                { expiresIn: "7d" }
            );

            OK(res, {
                auth: auth,
                token: token,
                refreshToken: refreshToken,
            });
        } else {
            OK(res, {
                auth: null,
                token: null,
                refreshToken: null,
            });
        }
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
