import { Request, Response } from "express";
import { ERROR, OK } from "../helpers/json";
import infographicSchema, { InfographicDocument } from "../schemas/infographic";

export const getAll = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string);
        const skip = (parseInt(req.query.page as string) - 1) * parseInt(req.query.limit as string);

        const infographics = await infographicSchema.find().sort({ _id: -1 }).skip(skip).limit(limit);
        const total = await infographicSchema.countDocuments();

        OK(res, {
            infographics: infographics,
            total: total,
        });
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const search = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string);
        const skip = (parseInt(req.query.page as string) - 1) * parseInt(req.query.limit as string);

        const filter = {
            [InfographicDocument.title]: {
                $regex: req.query.q as string,
                $options: "i",
            },
        };

        const infographics = await infographicSchema.find(filter).sort({ _id: -1 }).skip(skip).limit(limit);
        const total = await infographicSchema.countDocuments(filter);

        OK(res, {
            infographics: infographics,
            total: total,
        });
    } catch (e: any) {
        ERROR(res, e.message);
    }
};