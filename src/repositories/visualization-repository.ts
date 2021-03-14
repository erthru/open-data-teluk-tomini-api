import { Request, Response } from "express";
import { CREATED, ERROR, NO_CONTENT, OK, UNAUTHORIZED } from "../helpers/json";
import visualizationSchema, { VisualizationDocument } from "../schemas/visualization";
import authSchema, { AuthLevel } from "../schemas/auth";
import fs from "fs";
import path from "path";
import { createSlug } from "../helpers/generate-string";
import { VISUALIZATION_THUMBNAIL_FOR_SEEDER } from "../helpers/constants";

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

export const add = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.WRITER) {
            const visualization = await visualizationSchema.create({
                [VisualizationDocument.title]: req.body.title,
                [VisualizationDocument.body]: req.body.body,
                [VisualizationDocument.thumbnail]: req.file.filename,
                [VisualizationDocument.slug]: createSlug(req.body.title),
                [VisualizationDocument.organizationId]: req.body.organizationId,
                [VisualizationDocument.writerId]: req.body.writerId,
            });

            CREATED(res, { visualization: visualization });
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        if (req.file !== undefined) fs.unlinkSync(path.join(`public/uploads/${req.file.filename}`));
        ERROR(res, e.message);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.WRITER) {
            const oldVisualization = await visualizationSchema.findById(req.params.id);

            const visualization = await visualizationSchema.findByIdAndUpdate(
                req.params.id,
                {
                    [VisualizationDocument.title]: req.body.title,
                    [VisualizationDocument.body]: req.body.body,
                    [VisualizationDocument.thumbnail]: req.file === undefined ? oldVisualization?.thumbnail : req.file.filename,
                    [VisualizationDocument.organizationId]: req.body.organizationId,
                },
                { new: true }
            );

            if (req.file !== undefined && oldVisualization!!.thumbnail !== VISUALIZATION_THUMBNAIL_FOR_SEEDER)
                fs.unlinkSync(path.join(`public/uploads/${oldVisualization?.thumbnail}`));

            OK(res, { visualization: visualization });
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        if (req.file !== undefined) fs.unlinkSync(path.join(`public/uploads/${req.file.filename}`));
        ERROR(res, e.message);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.WRITER) {
            const visualization = await visualizationSchema.findByIdAndDelete(req.params.id);
            
            if (visualization!!.thumbnail !== VISUALIZATION_THUMBNAIL_FOR_SEEDER)
                fs.unlinkSync(path.join(`public/uploads/${visualization?.thumbnail}`));

            NO_CONTENT(res);
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
