import { Request, Response } from "express";
import { SEED_PASSWORD } from "../helpers/environments";
import { ERROR, UNAUTHORIZED } from "../helpers/json";

export const add = async (req: Request, res: Response) => {
    try {
        if (req.body.password === SEED_PASSWORD) {
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
