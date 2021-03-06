import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export enum AdminDocument {
    schemaName = "admin",
    fullName = "fullName",
    authId = "authId",
}

interface IAdmin extends Document {
    [AdminDocument.fullName]?: string;
    [AdminDocument.authId]?: string;
}

const schema = new Schema(
    {
        _id: {
            type: String,
            default: uuidV4,
        },

        [AdminDocument.fullName]: {
            type: String,
            required: true,
        },

        [AdminDocument.authId]: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IAdmin>(AdminDocument.schemaName, schema);
