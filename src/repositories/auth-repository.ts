import { Request, Response } from "express";
import { decrypt, encrypt } from "../helpers/encryption";
import { ERROR, OK, UNAUTHORIZED } from "../helpers/json";
import authSchema, { AuthDocument, AuthLevel } from "../schemas/auth";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../helpers/environments";
import adminSchema, { AdminDocument } from "../schemas/admin";
import organizationSchema, { OrganizationDocument } from "../schemas/organization";
import writerSchema, { WriterDocument } from "../schemas/writer";
import { ORGANIZATION_PHOTO_FOR_SEEDER } from "../helpers/constants";
import fs from "fs";
import path from "path";

export const refresh = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        const token = jwt.sign(
            {
                id: auth!!._id,
                isRefreshToken: false,
            },
            TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            {
                id: auth!!._id,
                isRefreshToken: true,
            },
            TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        OK(res, {
            auth: auth,
            token: token,
            refreshToken: refreshToken,
        });
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const get = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.ADMIN) {
            const admin = await adminSchema.findOne({ [AdminDocument.authId]: auth?._id });

            OK(res, {
                auth: auth,
                admin: admin,
            });
        }

        if (auth?.level === AuthLevel.ORGANIZATION) {
            const organization = await organizationSchema.findOne({ [OrganizationDocument.authId]: auth?._id });

            OK(res, {
                auth: auth,
                organization: organization,
            });
        }

        if (auth?.level === AuthLevel.WRITER) {
            const writer = await writerSchema.findOne({ [WriterDocument.authId]: auth?._id });

            OK(res, {
                auth: auth,
                writer: writer,
            });
        }
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findOne({ [AuthDocument.username]: req.body.username });

        if (auth !== null && decrypt(auth.password!!) === req.body.password) {
            const token = jwt.sign(
                {
                    id: auth._id,
                    isRefreshToken: false,
                },
                TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            const refreshToken = jwt.sign(
                {
                    id: auth._id,
                    isRefreshToken: true,
                },
                TOKEN_SECRET,
                { expiresIn: "7d" }
            );

            OK(res, {
                auth: auth,
                token: token,
                refreshToken: refreshToken,
            });
        } else {
            OK(res, {
                auth: null,
                token: null,
                refreshToken: null,
            });
        }
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const oldAuth = await authSchema.findById(req.authVerified.id);

        if (oldAuth?.level === AuthLevel.ADMIN) {
            const auth = await authSchema.findByIdAndUpdate(
                oldAuth._id,
                {
                    [AuthDocument.password]: encrypt(req.body.password),
                },
                { new: true }
            );

            const admin = await adminSchema.findOneAndUpdate(
                { [AdminDocument.authId]: auth?._id },
                {
                    [AdminDocument.fullName]: req.body.fullName,
                },
                { new: true }
            );

            OK(res, {
                auth: auth,
                admin: admin,
            });
        }

        if (oldAuth?.level === AuthLevel.ORGANIZATION) {
            const auth = await authSchema.findByIdAndUpdate(
                oldAuth._id,
                {
                    [AuthDocument.password]: encrypt(req.body.password),
                },
                { new: true }
            );

            const oldOrganization = await organizationSchema.findOne({ [OrganizationDocument.authId]: auth!!._id });

            if (req.file !== undefined && oldOrganization!!.photo !== ORGANIZATION_PHOTO_FOR_SEEDER)
                fs.unlinkSync(path.join("public/uploads/" + oldOrganization?.photo));

            const organization = await organizationSchema.findOneAndUpdate(
                { [OrganizationDocument.authId]: auth?._id },
                {
                    [OrganizationDocument.name]: req.body.name,
                    [OrganizationDocument.description]: req.body.description,
                    [OrganizationDocument.photo]: req.file === undefined ? oldOrganization!!.photo : req.file.filename,
                },
                { new: true }
            );

            OK(res, {
                auth: auth,
                organization: organization,
            });
        }

        if (oldAuth?.level === AuthLevel.WRITER) {
            const auth = await authSchema.findByIdAndUpdate(
                oldAuth._id,
                {
                    [AuthDocument.password]: encrypt(req.body.password),
                },
                { new: true }
            );

            const writer = await writerSchema.findOneAndUpdate(
                { [WriterDocument.authId]: auth?._id },
                {
                    [WriterDocument.fullName]: req.body.fullName,
                },
                { new: true }
            );

            OK(res, {
                auth: auth,
                writer: writer,
            });
        }
    } catch (e: any) {
        ERROR(res, e.mssage);
    }
};
