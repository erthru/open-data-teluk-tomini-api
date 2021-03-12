import { Request, Response } from "express";
import { ERROR, OK } from "../helpers/json";
import datasetSchema from "../schemas/dataset";

export const getAll = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string);
        const skip = (parseInt(req.query.page as string) - 1) * parseInt(req.query.limit as string);

        const datasets = await datasetSchema.find().sort({ _id: -1 }).skip(skip).limit(limit);
        const total = await datasetSchema.countDocuments();

        OK(res, {
            datasets: datasets,
            total: total,
        });
    } catch (e: any) {
        ERROR(res, e.mssage);
    }
};
