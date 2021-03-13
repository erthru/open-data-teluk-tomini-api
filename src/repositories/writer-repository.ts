import { Request, Response } from "express";
import { CREATED, ERROR, OK, UNAUTHORIZED, NO_CONTENT } from "../helpers/json";
import writerSchema, { WriterDocument } from "../schemas/writer";
import authSchema, { AuthDocument, AuthLevel } from "../schemas/auth";
import { encrypt } from "../helpers/encryption";

export const getAll = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.ADMIN) {
            const writers = await writerSchema.find().sort({ _id: -1 });

            OK(res, {
                writers: writers,
                total: writers.length,
            });
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const add = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.ADMIN) {
            const newAuth = await authSchema.create({
                [AuthDocument.username]: req.body.username,
                [AuthDocument.password]: encrypt(req.body.password),
                [AuthDocument.level]: AuthLevel.WRITER,
            });

            const writer = await writerSchema.create({
                [WriterDocument.fullName]: req.body.fullName,
                [WriterDocument.authId]: newAuth._id,
            });

            CREATED(res, { writer: writer });
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.ADMIN) {
            const writer = await writerSchema.findByIdAndUpdate(
                req.params.id,
                {
                    [WriterDocument.fullName]: req.body.fullName,
                },
                { new: true }
            );

            await authSchema.findByIdAndUpdate(writer?.authId, {
                [AuthDocument.password]: encrypt(req.body.password),
            });

            OK(res, { writer: writer });
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.ADMIN) {
            const writer = await writerSchema.findByIdAndDelete(req.params.id);
            await authSchema.findByIdAndDelete(writer?.authId);
            NO_CONTENT(res);
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
