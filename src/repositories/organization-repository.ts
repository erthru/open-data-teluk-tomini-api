import { Request, Response } from "express";
import { ERROR, OK } from "../helpers/json";
import datasetSchema, { DatasetDocument } from "../schemas/dataset";
import organizationSchema, { OrganizationDocument } from "../schemas/organization";

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

export const getBySlug = async (req: Request, res: Response) => {
    try {
        const organization = await organizationSchema.findOne({ [OrganizationDocument.slug]: req.params.slug });
        OK(res, { organization: organization });
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
