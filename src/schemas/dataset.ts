import mongoose, { Document, Schema } from "mongoose";
import { BASE_URL } from "../helpers/environments";
import { CategoryDocument } from "./category";
import { OrganizationDocument } from "./organization";

export enum DatasetDocument {
    schemaName = "dataset",
    title = "title",
    description = "description",
    source = "source",
    year = "year",
    contact = "contact",
    reference = "reference",
    attachment = "attachment",
    slug = "slug",
    downloaded = "downloaded",
    tagIds = "tagIds",
    categoryId = "categoryId",
    organizationId = "organizationId",
}

interface IDataset extends Document {
    [DatasetDocument.title]?: string;
    [DatasetDocument.description]?: string;
    [DatasetDocument.source]?: string;
    [DatasetDocument.year]?: string;
    [DatasetDocument.contact]?: string;
    [DatasetDocument.reference]?: string;
    [DatasetDocument.attachment]?: string;
    [DatasetDocument.slug]?: string;
    [DatasetDocument.downloaded]?: number;
    [DatasetDocument.tagIds]?: string[];
    [DatasetDocument.categoryId]?: string;
    [DatasetDocument.organizationId]?: string;
}

const schema = new Schema(
    {
        [DatasetDocument.title]: {
            type: String,
            required: true,
        },

        [DatasetDocument.description]: {
            type: String,
        },

        [DatasetDocument.source]: {
            type: String,
        },

        [DatasetDocument.year]: {
            type: String,
        },

        [DatasetDocument.contact]: {
            type: String,
        },

        [DatasetDocument.reference]: {
            type: String,
        },

        [DatasetDocument.attachment]: {
            type: String,
            required: true,
        },

        [DatasetDocument.slug]: {
            type: String,
            required: true,
            unique: true,
        },

        [DatasetDocument.downloaded]: {
            type: Number,
            required: true,
        },

        [DatasetDocument.tagIds]: {
            type: [String],
            required: true,
        },

        [DatasetDocument.categoryId]: {
            type: String,
            required: true,
        },

        [DatasetDocument.organizationId]: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

schema.virtual(CategoryDocument.schemaName, {
    ref: CategoryDocument.schemaName,
    localField: DatasetDocument.categoryId,
    foreignField: "_id",
    justOne: true,
});

schema.virtual(OrganizationDocument.schemaName, {
    ref: OrganizationDocument.schemaName,
    localField: DatasetDocument.organizationId,
    foreignField: "_id",
    justOne: true,
});

schema.set("toJSON", {
    transform: (_: any, ret: any, __: any) => {
        delete ret.id;
        ret[DatasetDocument.attachment] = BASE_URL + "uploads/" + ret[DatasetDocument.attachment];

        return ret;
    },

    virtuals: true,
});

export default mongoose.model<IDataset>(DatasetDocument.schemaName, schema);
