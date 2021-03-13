import { Request, Response } from "express";
import { Mode, MODE, SEED_PASSWORD } from "../helpers/environments";
import { ERROR, UNAUTHORIZED } from "../helpers/json";
import faker from "faker";
import { CATEGORY_ICONS, CATEGORY_NAMES, ORGANIZATION_PHOTO_FOR_SEEDER } from "../helpers/constants";
import categorySchema, { CategoryDocument } from "../schemas/category";
import authSchema, { AuthDocument, AuthLevel } from "../schemas/auth";
import adminSchema, { AdminDocument } from "../schemas/admin";
import { encrypt } from "../helpers/encryption";
import organizationSchema, { OrganizationDocument } from "../schemas/organization";

export const add = async (req: Request, res: Response) => {
    try {
        if (req.body.password === SEED_PASSWORD) {
            for (let i = 0; i < CATEGORY_NAMES.length; i++) {
                await categorySchema.create({
                    [CategoryDocument.name]: CATEGORY_NAMES[i],
                    [CategoryDocument.icon]: CATEGORY_ICONS[i],
                });
            }

            const authForAdmin = await authSchema.create({
                [AuthDocument.username]: "admin",
                [AuthDocument.password]: encrypt("admin"),
                [AuthDocument.level]: AuthLevel.ADMIN,
            });

            await adminSchema.create({
                [AdminDocument.fullName]: "Open Data Administrator",
                [AdminDocument.authId]: authForAdmin._id,
            });

            if (MODE === Mode.dev) {
                const authForOrganization0 = await authSchema.create({
                    [AuthDocument.username]: "organization_0",
                    [AuthDocument.password]: encrypt("organization"),
                    [AuthDocument.level]: AuthLevel.ORGANIZATION
                })

                await organizationSchema.create({
                    [OrganizationDocument.name]: faker.company.companyName(),
                    [OrganizationDocument.description]: faker.lorem.paragraph(),
                    [OrganizationDocument.photo]: ORGANIZATION_PHOTO_FOR_SEEDER,
                    [OrganizationDocument.authId]: authForOrganization0._id
                })

                const authForOrganization1 = await authSchema.create({
                    [AuthDocument.username]: "organization_1",
                    [AuthDocument.password]: encrypt("organization"),
                    [AuthDocument.level]: AuthLevel.ORGANIZATION
                })

                await organizationSchema.create({
                    [OrganizationDocument.name]: faker.company.companyName(),
                    [OrganizationDocument.description]: faker.lorem.paragraph(),
                    [OrganizationDocument.photo]: ORGANIZATION_PHOTO_FOR_SEEDER,
                    [OrganizationDocument.authId]: authForOrganization1._id
                })

                
            }
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
