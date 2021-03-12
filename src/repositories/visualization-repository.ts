import { Request, Response } from "express";
import { ERROR, OK } from "../helpers/json";
import visualizationSchema from "../schemas/visualization";

export const getAll = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string);
        const skip = (parseInt(req.query.page as string) - 1) * parseInt(req.query.limit as string);

        const visualizations = await visualizationSchema.find().sort({ _id: -1 }).skip(skip).limit(limit);
        const total = await visualizationSchema.countDocuments();

        OK(res, {
            visualizations: visualizations,
            total: total,
        });
    } catch (e: any) {
        ERROR(res, e.message);
    }
};