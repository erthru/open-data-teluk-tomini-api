import mongoose, { Document, Schema } from "mongoose";

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

export default mongoose.model<IVisualization>(VisualizatioNDocument.schemaName, schema);
