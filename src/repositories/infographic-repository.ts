import { Request, Response } from "express";
import { CREATED, ERROR, NO_CONTENT, OK, UNAUTHORIZED } from "../helpers/json";
import infographicSchema, { InfographicDocument } from "../schemas/infographic";
import authSchema, { AuthLevel } from "../schemas/auth";
import fs from "fs";
import path from "path";
import { INFOGRAPHIC_BANNER_FOR_SEEDER } from "../helpers/constants";

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

export const add = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.WRITER) {
            const infographic = await infographicSchema.create({
                [InfographicDocument.title]: req.body.title,
                [InfographicDocument.banner]: req.file.filename,
                [InfographicDocument.writerId]: req.body.writerId,
            });

            CREATED(res, { infographic: infographic });
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
            const oldInfographic = await infographicSchema.findById(req.params.id);

            const infographic = await infographicSchema.findByIdAndUpdate(
                req.params.id,
                {
                    [InfographicDocument.title]: req.body.title,
                    [InfographicDocument.banner]: req.file === undefined ? oldInfographic?.banner : req.file.filename,
                },
                { new: true }
            );

            if (req.file !== undefined && oldInfographic!!.banner !== INFOGRAPHIC_BANNER_FOR_SEEDER)
                fs.unlinkSync(path.join(`public/uploads/${oldInfographic?.banner}`));

            OK(res, { infographic: infographic });
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
            const infographic = await infographicSchema.findByIdAndDelete(req.params.id);
            if (infographic!!.banner !== INFOGRAPHIC_BANNER_FOR_SEEDER) fs.unlinkSync(path.join(`public/uploads/${infographic?.banner}`));
            NO_CONTENT(res);
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
