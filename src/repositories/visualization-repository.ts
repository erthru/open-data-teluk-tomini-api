import { Request, Response } from "express";
import { ERROR, OK } from "../helpers/json";
import visualizationSchema, { VisualizationDocument } from "../schemas/visualization";

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

export const search = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string);
        const skip = (parseInt(req.query.page as string) - 1) * parseInt(req.query.limit as string);

        const filter = {
            [VisualizationDocument.title]: {
                $regex: req.query.q as string,
                $options: "i",
            },
        };

        const visualizations = await visualizationSchema.find(filter).sort({ _id: -1 }).skip(skip).limit(limit);
        const total = await visualizationSchema.countDocuments(filter);

        OK(res, {
            visualizations: visualizations,
            total: total,
        });
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const getBySlug = async (req: Request, res: Response) => {
    try {
        const visualization = await visualizationSchema.findOne({ [VisualizationDocument.slug]: req.params.slug });
        OK(res, { visualization: visualization });
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
