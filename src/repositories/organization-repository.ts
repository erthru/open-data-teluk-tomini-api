import { Request, Response } from "express";
import { CREATED, ERROR, NO_CONTENT, OK, UNAUTHORIZED } from "../helpers/json";
import datasetSchema, { DatasetDocument } from "../schemas/dataset";
import organizationSchema, { OrganizationDocument } from "../schemas/organization";
import authSchema, { AuthDocument, AuthLevel } from "../schemas/auth";
import { encrypt } from "../helpers/encryption";
import { createSlug } from "../helpers/generate-string";
import fs from "fs";
import path from "path";
import { ORGANIZATION_PHOTO_FOR_SEEDER } from "../helpers/constants";

const getOrganizationsWithDatasetsTotal = async (organizations: any[]): Promise<any[]> => {
    const fixedOrganizations = [];

    for (let organization of organizations) {
        const datasetsTotal = await datasetSchema.countDocuments({ [DatasetDocument.organizationId]: organization._id });

        fixedOrganizations.push({
            ...organization.toJSON(),
            datasetsTotal: datasetsTotal,
        });
    }

    return fixedOrganizations;
};

export const getAllWithDatasetsTotal = async (req: Request, res: Response) => {
    try {
        const organizations = await organizationSchema.find().sort({ [OrganizationDocument.name]: 1 });
        const organizationsWithDatasetsTotal = await getOrganizationsWithDatasetsTotal(organizations);

        OK(res, {
            organizations: organizationsWithDatasetsTotal,
            total: organizations.length,
        });
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const organizations = await organizationSchema.find().sort({ [OrganizationDocument.name]: 1 });

        OK(res, {
            organizations: organizations,
            total: organizations.length,
        });
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const getBySlug = async (req: Request, res: Response) => {
    try {
        const organization = await organizationSchema.findOne({ [OrganizationDocument.slug]: req.params.slug });
        OK(res, { organization: organization });
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
                [AuthDocument.level]: AuthLevel.ORGANIZATION,
            });

            const organization = await organizationSchema.create({
                [OrganizationDocument.name]: req.body.name,
                [OrganizationDocument.description]: req.body.description,
                [OrganizationDocument.photo]: req.file.filename,
                [OrganizationDocument.slug]: createSlug(req.body.name),
                [OrganizationDocument.authId]: newAuth._id,
            });

            CREATED(res, { organization: organization });
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.ADMIN) {
            const oldOrganization = await organizationSchema.findById(req.params.id);

            if (req.file !== undefined && oldOrganization!!.photo !== ORGANIZATION_PHOTO_FOR_SEEDER)
                fs.unlinkSync(path.join("public/uploads/" + oldOrganization?.photo));

            const organization = await organizationSchema.findByIdAndUpdate(
                req.params.id,
                {
                    [OrganizationDocument.name]: req.body.name,
                    [OrganizationDocument.description]: req.body.description,
                    [OrganizationDocument.photo]: req.file !== undefined ? req.file.filename : oldOrganization?.photo,
                },
                { new: true }
            );

            await authSchema.findByIdAndUpdate(organization?.authId, {
                [AuthDocument.password]: encrypt(req.body.password),
            });

            OK(res, { organization: organization });
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);

        if (auth?.level === AuthLevel.ADMIN) {
            const organization = await organizationSchema.findByIdAndDelete(req.params.id);
            if (organization!!.photo !== ORGANIZATION_PHOTO_FOR_SEEDER) fs.unlinkSync(path.join("public/uploads/" + organization?.photo));
            await authSchema.findByIdAndDelete(organization?.authId);
            NO_CONTENT(res);
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
