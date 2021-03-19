import { Request, Response } from "express";
import { CREATED, ERROR, NO_CONTENT, OK, UNAUTHORIZED } from "../helpers/json";
import { CategoryDocument } from "../schemas/category";
import datasetSchema, { DatasetDocument } from "../schemas/dataset";
import { OrganizationDocument } from "../schemas/organization";
import tagSchema from "../schemas/tag";
import authSchema, { AuthLevel } from "../schemas/auth";
import organizationSchema from "../schemas/organization";
import { createSlug } from "../helpers/generate-string";
import { DATASET_ATTACHMENT_FOR_SEEDER } from "../helpers/constants";
import fs from "fs";
import path from "path";

const getDatasetsWithTags = async (datasets: any[]): Promise<any[]> => {
    const fixedDatasets: any[] = [];

    for (let dataset of datasets) {
        const tags: any[] = [];

        for (let tagId of dataset?.tagIds!!) {
            const tag = await tagSchema.findById(tagId);
            tags.push(tag);
        }

        fixedDatasets.push({
            ...dataset.toJSON(),
            tags: tags,
        });
    }

    return fixedDatasets;
};

const getDatasetWithTags = async (dataset: any): Promise<any> => {
    const tags: any[] = [];

    for (let tagId of dataset?.tagIds!!) {
        const tag = await tagSchema.findById(tagId);
        tags.push(tag);
    }

    const fixedDataset = {
        ...dataset.toJSON(),
        tags: tags,
    };

    return fixedDataset;
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string);
        const skip = (parseInt(req.query.page as string) - 1) * parseInt(req.query.limit as string);

        const datasets = await datasetSchema
            .find()
            .sort({ _id: -1 })
            .populate(CategoryDocument.schemaName)
            .populate(OrganizationDocument.schemaName)
            .skip(skip)
            .limit(limit);

        const datasetsWithTags = await getDatasetsWithTags(datasets);
        const total = await datasetSchema.countDocuments();

        OK(res, {
            datasets: datasetsWithTags,
            total: total,
        });
    } catch (e: any) {
        ERROR(res, e.mssage);
    }
};

export const getAllByCategoryId = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string);
        const skip = (parseInt(req.query.page as string) - 1) * parseInt(req.query.limit as string);

        const filter = {
            [DatasetDocument.categoryId]: req.params.categoryId,
        };

        const datasets = await datasetSchema
            .find(filter)
            .sort({ _id: -1 })
            .populate(CategoryDocument.schemaName)
            .populate(OrganizationDocument.schemaName)
            .skip(skip)
            .limit(limit);

        const datasetsWithTags = await getDatasetsWithTags(datasets);
        const total = await datasetSchema.countDocuments(filter);

        OK(res, {
            datasets: datasetsWithTags,
            total: total,
        });
    } catch (e: any) {
        ERROR(res, e.mssage);
    }
};

export const getAllByOrganizationId = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string);
        const skip = (parseInt(req.query.page as string) - 1) * parseInt(req.query.limit as string);

        const filter = {
            [DatasetDocument.organizationId]: req.params.organizationId,
        };

        const datasets = await datasetSchema
            .find(filter)
            .sort({ _id: -1 })
            .populate(CategoryDocument.schemaName)
            .populate(OrganizationDocument.schemaName)
            .skip(skip)
            .limit(limit);

        const datasetsWithTags = await getDatasetsWithTags(datasets);
        const total = await datasetSchema.countDocuments(filter);

        OK(res, {
            datasets: datasetsWithTags,
            total: total,
        });
    } catch (e: any) {
        ERROR(res, e.mssage);
    }
};

export const search = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string);
        const skip = (parseInt(req.query.page as string) - 1) * parseInt(req.query.limit as string);

        const filter = {
            [DatasetDocument.title]: {
                $regex: req.query.q as string,
                $options: "i",
            },
        };

        const datasets = await datasetSchema
            .find(filter)
            .sort({ _id: -1 })
            .populate(CategoryDocument.schemaName)
            .populate(OrganizationDocument.schemaName)
            .skip(skip)
            .limit(limit);

        const datasetsWithTags = await getDatasetsWithTags(datasets);
        const total = await datasetSchema.countDocuments(filter);

        OK(res, {
            datasets: datasetsWithTags,
            total: total,
        });
    } catch (e: any) {
        ERROR(res, e.mssage);
    }
};

export const getBySlug = async (req: Request, res: Response) => {
    try {
        const dataset = await datasetSchema
            .findOne({ [DatasetDocument.slug]: req.params.slug })
            .populate(CategoryDocument.schemaName)
            .populate(OrganizationDocument.schemaName);

        const datasetWithTags = await getDatasetWithTags(dataset);

        OK(res, { dataset: datasetWithTags });
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const add = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);
        const organization = await organizationSchema.findOne({ [OrganizationDocument.authId]: auth?._id });

        if (auth?.level === AuthLevel.ORGANIZATION) {
            const dataset = await datasetSchema.create({
                [DatasetDocument.title]: req.body.title,
                [DatasetDocument.description]: req.body.description,
                [DatasetDocument.source]: req.body.source,
                [DatasetDocument.year]: req.body.year,
                [DatasetDocument.contact]: req.body.contact,
                [DatasetDocument.reference]: req.body.reference,
                [DatasetDocument.attachment]: req.file.filename,
                [DatasetDocument.slug]: createSlug(req.body.title),
                [DatasetDocument.downloaded]: 0,
                [DatasetDocument.tagIds]: req.body.tagIds,
                [DatasetDocument.categoryId]: req.body.categoryId,
                [DatasetDocument.organizationId]: organization?._id,
            });

            CREATED(res, { dataset: dataset });
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        if (req.file !== undefined) fs.unlinkSync(path.join(`public/uploads/${req.file.filename}`));
        ERROR(res, e.message);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);
        const organization = await organizationSchema.findOne({ [OrganizationDocument.authId]: auth?._id });
        const oldDataset = await datasetSchema.findById(req.params.id);

        if (auth?.level === AuthLevel.ORGANIZATION && oldDataset?.organizationId === organization?._id.toString()) {
            const dataset = await datasetSchema.findByIdAndUpdate(
                req.params.id,
                {
                    [DatasetDocument.title]: req.body.title,
                    [DatasetDocument.description]: req.body.description,
                    [DatasetDocument.source]: req.body.source,
                    [DatasetDocument.year]: req.body.year,
                    [DatasetDocument.contact]: req.body.contact,
                    [DatasetDocument.reference]: req.body.reference,
                    [DatasetDocument.attachment]: req.file === undefined ? oldDataset?.attachment : req.file.filename,
                    [DatasetDocument.tagIds]: req.body.tagIds,
                    [DatasetDocument.categoryId]: req.body.categoryId,
                },
                { new: true }
            );

            if (req.file !== undefined && oldDataset!!.attachment !== DATASET_ATTACHMENT_FOR_SEEDER)
                fs.unlinkSync(path.join(`public/uploads/${oldDataset?.attachment}`));

            OK(res, { dataset: dataset });
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        if (req.file !== undefined) fs.unlinkSync(path.join(`public/uploads/${req.file.filename}`));
        ERROR(res, e.message);
    }
};

export const updateIncrementDownloaded = async (req: Request, res: Response) => {
    try {
        const oldDataset = await datasetSchema.findById(req.params.id);

        const dataset = await datasetSchema.findByIdAndUpdate(
            req.params.id,
            {
                [DatasetDocument.downloaded]: oldDataset?.downloaded!! + 1,
            },
            { new: true }
        );

        OK(res, { dataset: dataset });
    } catch (e: any) {
        ERROR(res, e.message);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const auth = await authSchema.findById(req.authVerified.id);
        const organization = await organizationSchema.findOne({ [OrganizationDocument.authId]: auth?._id });
        const dataset = await datasetSchema.findById(req.params.id);

        if (auth?.level === AuthLevel.ORGANIZATION && dataset?.organizationId === organization?._id.toString()) {
            await datasetSchema.findByIdAndDelete(req.params.id);
            if (dataset!!.attachment !== DATASET_ATTACHMENT_FOR_SEEDER) fs.unlinkSync(path.join(`public/uploads/${dataset?.attachment}`));
            NO_CONTENT(res);
        } else UNAUTHORIZED(res);
    } catch (e: any) {
        ERROR(res, e.message);
    }
};
