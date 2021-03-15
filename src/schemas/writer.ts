import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export enum WriterDocument {
    schemaName = "writer",
    fullName = "fullName",
    authId = "authId",
}

interface IWriter extends Document {
    [WriterDocument.fullName]?: string;
    [WriterDocument.authId]?: string;
}

const schema = new Schema(
    {
        _id: {
            type: String,
            default: uuidV4,
        },

        [WriterDocument.fullName]: {
            type: String,
            required: true,
        },

        [WriterDocument.authId]: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IWriter>(WriterDocument.schemaName, schema);
