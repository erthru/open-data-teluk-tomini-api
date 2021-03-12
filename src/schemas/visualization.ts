import mongoose, { Document, Schema } from "mongoose";
import { BASE_URL } from "../helpers/environments";
import { OrganizationDocument } from "./organization";
import { WriterDocument } from "./writer";

export enum VisualizatioNDocument {
    schemaName = "visualization",
    title = "title",
    body = "body",
    slug = "slug",
    thumbnail = "thumbnail",
    organizationId = "organizationId",
    writerId = "writerId",
}

interface IVisualization extends Document {
    [VisualizatioNDocument.title]?: string;
    [VisualizatioNDocument.body]?: string;
    [VisualizatioNDocument.slug]?: string;
    [VisualizatioNDocument.thumbnail]?: string;
    [VisualizatioNDocument.organizationId]?: string;
    [VisualizatioNDocument.writerId]?: string;
}

const schema = new Schema(
    {
        [VisualizatioNDocument.title]: {
            type: String,
            required: true,
        },

        [VisualizatioNDocument.body]: {
            type: String,
            required: true,
        },

        [VisualizatioNDocument.slug]: {
            type: String,
            required: true,
            unique: true,
        },

        [VisualizatioNDocument.thumbnail]: {
            type: String,
            required: true,
        },

        [VisualizatioNDocument.organizationId]: {
            type: String,
            required: true,
        },

        [VisualizatioNDocument.writerId]: {
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
    localField: VisualizatioNDocument.organizationId,
    foreignField: "_id",
    justOne: true,
});

schema.virtual(WriterDocument.schemaName, {
    ref: WriterDocument.schemaName,
    localField: VisualizatioNDocument.writerId,
    foreignField: "_id",
    justOne: true,
});

schema.set("toJSON", {
    transform: (_: any, ret: any, __: any) => {
        delete ret.id;
        ret[VisualizatioNDocument.thumbnail] = BASE_URL + "uploads/" + ret[VisualizatioNDocument.thumbnail];

        return ret;
    },

    virtuals: true,
});

export default mongoose.model<IVisualization>(VisualizatioNDocument.schemaName, schema);
