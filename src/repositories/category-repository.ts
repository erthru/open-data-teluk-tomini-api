import { Request, Response } from "express";
import { ERROR, OK } from "../helpers/json";
import categorySchema, { CategoryDocument } from "../schemas/category";

export const getAll = async (req: Request, res: Response) => {
    try {
        const categories = await categorySchema.find().sort({ [CategoryDocument.name]: 1 });

        OK(res, {
            categories: categories,
            total: categories.length,
        });
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
