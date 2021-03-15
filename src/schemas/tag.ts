import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export enum TagDocument {
    schemaName = "tag",
    name = "name",
}

interface ITag extends Document {
    [TagDocument.name]?: string;
}

const schema = new Schema(
    {
        _id: {
            type: String,
            default: uuidV4,
        },

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
