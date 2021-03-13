import { Request, Response } from "express";
import { ERROR, OK } from "../helpers/json";
import { CategoryDocument } from "../schemas/category";
import datasetSchema, { DatasetDocument } from "../schemas/dataset";
import { OrganizationDocument } from "../schemas/organization";
import tagSchema from "../schemas/tag";

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
