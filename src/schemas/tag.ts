import mongoose, { Document, Schema } from "mongoose";

export enum TagDocument {
    schemaName = "tag",
    name = "name",
}

interface ITag extends Document {
    [TagDocument.name]?: string;
}

const schema = new Schema(
    {
        [TagDocument.name]: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITag>(TagDocument.schemaName, schema);
