import { Request, Response } from "express";
import { CREATED, ERROR, NO_CONTENT, OK, UNAUTHORIZED } from "../helpers/json";
import categorySchema, { CategoryDocument } from "../schemas/category";
import authSchema, { AuthLevel } from "../schemas/auth";
import { CATEGORY_ICONS } from "../helpers/constants";
import fs from "fs";
import path from "path";

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

export const add = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.ADMIN) {
            const category = await categorySchema.create({
                [CategoryDocument.name]: req.body.name,
                [CategoryDocument.icon]: req.file.filename,
            });

            CREATED(res, { category: category });
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        if (req.file !== undefined) fs.unlinkSync(path.join(`public/uploads/${req.file.filename}`));
        ERROR(res, e.message);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.ADMIN) {
            const oldCategory = await categorySchema.findById(req.params.id);

            const category = await categorySchema.findByIdAndUpdate(
                req.params.id,
                {
                    [CategoryDocument.name]: req.body.name,
                    [CategoryDocument.icon]: req.file === undefined ? oldCategory?.icon : req.file.filename,
                },
                { new: true }
            );

            if (req.file !== undefined && !CATEGORY_ICONS.includes(oldCategory?.icon!!))
                fs.unlinkSync(path.join(`public/uploads/${oldCategory?.icon}`));

            OK(res, { category: category });
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        if (req.file !== undefined) fs.unlinkSync(path.join(`public/uploads/${req.file.filename}`));
        ERROR(res, e.message);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.ADMIN) {
            const category = await categorySchema.findByIdAndDelete(req.params.id);
            if (!CATEGORY_ICONS.includes(category?.icon!!)) fs.unlinkSync(path.join(`public/uploads/${category?.icon}`));
            NO_CONTENT(res);
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
