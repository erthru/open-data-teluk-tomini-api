import mongoose, { Document, Schema } from "mongoose";
import { BASE_URL } from "../helpers/environments";
import { OrganizationDocument } from "./organization";
import { WriterDocument } from "./writer";
import { v4 as uuidV4 } from "uuid";

export enum VisualizationDocument {
    schemaName = "visualization",
    title = "title",
    body = "body",
    slug = "slug",
    thumbnail = "thumbnail",
    organizationId = "organizationId",
    writerId = "writerId",
}

interface IVisualization extends Document {
    [VisualizationDocument.title]?: string;
    [VisualizationDocument.body]?: string;
    [VisualizationDocument.slug]?: string;
    [VisualizationDocument.thumbnail]?: string;
    [VisualizationDocument.organizationId]?: string;
    [VisualizationDocument.writerId]?: string;
}

const schema = new Schema(
    {
        _id: {
            type: String,
            default: uuidV4,
        },

        [VisualizationDocument.title]: {
            type: String,
            required: true,
        },

        [VisualizationDocument.body]: {
            type: String,
            required: true,
        },

        [VisualizationDocument.slug]: {
            type: String,
            required: true,
            unique: true,
        },

        [VisualizationDocument.thumbnail]: {
            type: String,
            required: true,
        },

        [VisualizationDocument.organizationId]: {
            type: String,
            required: true,
        },

        [VisualizationDocument.writerId]: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

schema.virtual(OrganizationDocument.schemaName, {
    ref: OrganizationDocument.schemaName,
    localField: VisualizationDocument.organizationId,
    foreignField: "_id",
    justOne: true,
});

schema.virtual(WriterDocument.schemaName, {
    ref: WriterDocument.schemaName,
    localField: VisualizationDocument.writerId,
    foreignField: "_id",
    justOne: true,
});

schema.set("toJSON", {
    transform: (_: any, ret: any, __: any) => {
        delete ret.id;
        ret[VisualizationDocument.thumbnail] = BASE_URL + "uploads/" + ret[VisualizationDocument.thumbnail];

        return ret;
    },

    virtuals: true,
});

export default mongoose.model<IVisualization>(VisualizationDocument.schemaName, schema);
