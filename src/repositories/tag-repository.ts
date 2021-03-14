import { Request, Response } from "express";
import { CREATED, ERROR, OK, UNAUTHORIZED } from "../helpers/json";
import tagSchema, { TagDocument } from "../schemas/tag";
import authSchema, { AuthLevel } from "../schemas/auth";

export const add = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.ORGANIZATION) {
            const name = (req.body.name as string).toLocaleLowerCase();
            const checkTag = await tagSchema.findOne({ [TagDocument.name]: name });

            if (checkTag === null) {
                const tag = await tagSchema.create({
                    [TagDocument.name]: name,
                });

                CREATED(res, { tag: tag });
            } else OK(res, { tag: checkTag });
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
