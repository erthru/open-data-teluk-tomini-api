import { Request, Response } from "express";
import { Mode, MODE, SEEDER_PASSWORD } from "../helpers/environments";
import { CREATED, ERROR, UNAUTHORIZED } from "../helpers/json";
import faker from "faker";
import {
    CATEGORY_ICONS,
    CATEGORY_NAMES,
    DATASET_ATTACHMENT_FOR_SEEDER,
    INFOGRAPHIC_BANNER_FOR_SEEDER,
    ORGANIZATION_PHOTO_FOR_SEEDER,
    VISUALIZATION_THUMBNAIL_FOR_SEEDER,
} from "../helpers/constants";
import categorySchema, { CategoryDocument } from "../schemas/category";
import authSchema, { AuthDocument, AuthLevel } from "../schemas/auth";
import adminSchema, { AdminDocument } from "../schemas/admin";
import { encrypt } from "../helpers/encryption";
import organizationSchema, { OrganizationDocument } from "../schemas/organization";
import writerSchema, { WriterDocument } from "../schemas/writer";
import datasetSchema, { DatasetDocument } from "../schemas/dataset";
import { createSlug } from "../helpers/generate-string";
import tagSchema, { TagDocument } from "../schemas/tag";
import infographicSchema, { InfographicDocument } from "../schemas/infographic";
import visualizationSchema, { VisualizationDocument } from "../schemas/visualization";

export const add = async (req: Request, res: Response) => {
    try {
        if (req.body.password === SEEDER_PASSWORD) {
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
                    [AuthDocument.level]: AuthLevel.ORGANIZATION,
                });

                await organizationSchema.create({
                    [OrganizationDocument.name]: faker.company.companyName(),
                    [OrganizationDocument.description]: faker.lorem.paragraph(),
                    [OrganizationDocument.photo]: ORGANIZATION_PHOTO_FOR_SEEDER,
                    [OrganizationDocument.authId]: authForOrganization0._id,
                });

                const authForOrganization1 = await authSchema.create({
                    [AuthDocument.username]: "organization_1",
                    [AuthDocument.password]: encrypt("organization"),
                    [AuthDocument.level]: AuthLevel.ORGANIZATION,
                });

                await organizationSchema.create({
                    [OrganizationDocument.name]: faker.company.companyName(),
                    [OrganizationDocument.description]: faker.lorem.paragraph(),
                    [OrganizationDocument.photo]: ORGANIZATION_PHOTO_FOR_SEEDER,
                    [OrganizationDocument.authId]: authForOrganization1._id,
                });

                const authForWriter = await authSchema.create({
                    [AuthDocument.username]: "writer",
                    [AuthDocument.password]: encrypt("writer"),
                    [AuthDocument.level]: AuthLevel.WRITER,
                });

                await writerSchema.create({
                    [WriterDocument.fullName]: "Kayla Olivia",
                    [WriterDocument.authId]: authForWriter._id,
                });

                for (let i = 0; i < 100; i++) {
                    const categoryId = (await categorySchema.find())[Math.floor(Math.random() * categorySchema.length)]._id!!;
                    const organizationId = (await organizationSchema.find())[Math.floor(Math.random() * 2)]._id!!;
                    const title = faker.lorem.lines();
                    const tagIds: string[] = [];

                    for (let i = 0; i < 3; i++) {
                        const tag = await tagSchema.create({
                            [TagDocument.name]: `tag${i + 1}`,
                        });

                        tagIds.push(tag._id);
                    }

                    await datasetSchema.create({
                        [DatasetDocument.title]: title,
                        [DatasetDocument.description]: faker.lorem.paragraph(),
                        [DatasetDocument.source]: "-",
                        [DatasetDocument.year]: "2020",
                        [DatasetDocument.contact]: "-",
                        [DatasetDocument.reference]: "-",
                        [DatasetDocument.attachment]: DATASET_ATTACHMENT_FOR_SEEDER,
                        [DatasetDocument.slug]: createSlug(title),
                        [DatasetDocument.downloaded]: 0,
                        [DatasetDocument.tagIds]: tagIds,
                        [DatasetDocument.categoryId]: categoryId,
                        [DatasetDocument.organizationId]: organizationId,
                    });
                }

                for (let i = 0; i < 14; i++) {
                    const writerId = (await writerSchema.find())[0]._id;

                    await infographicSchema.create({
                        [InfographicDocument.title]: faker.lorem.lines(),
                        [InfographicDocument.banner]: INFOGRAPHIC_BANNER_FOR_SEEDER,
                        [InfographicDocument.writerId]: writerId,
                    });
                }

                for (let i = 0; i < 14; i++) {
                    const organizationId = (await organizationSchema.find())[Math.floor(Math.random() * 2)]._id!!;
                    const writerId = (await writerSchema.find())[0]._id;
                    const title = faker.lorem.lines();

                    await visualizationSchema.create({
                        [VisualizationDocument.title]: title,
                        [VisualizationDocument.body]: faker.lorem.paragraphs(),
                        [VisualizationDocument.slug]: createSlug(title),
                        [VisualizationDocument.thumbnail]: VISUALIZATION_THUMBNAIL_FOR_SEEDER,
                        [VisualizationDocument.organizationId]: organizationId,
                        [VisualizationDocument.writerId]: writerId,
                    });
                }

                CREATED(res);
            }
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
