import mongoose, { Document, Schema } from "mongoose";
import { BASE_URL } from "../helpers/environments";
import { WriterDocument } from "./writer";
import { v4 as uuidV4 } from "uuid";

export enum InfographicDocument {
    schemaName = "infographic",
    title = "title",
    banner = "banner",
    writerId = "writerId",
}

interface IInfographic extends Document {
    [InfographicDocument.title]?: string;
    [InfographicDocument.banner]?: string;
    [InfographicDocument.writerId]?: string;
}

const schema = new Schema(
    {
        _id: {
            type: String,
            default: uuidV4,
        },

        [InfographicDocument.title]: {
            type: String,
            required: true,
        },

        [InfographicDocument.banner]: {
            type: String,
            required: true,
        },

        [InfographicDocument.writerId]: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

schema.virtual(WriterDocument.schemaName, {
    ref: WriterDocument.schemaName,
    localField: InfographicDocument.writerId,
    foreignField: "_id",
    justOne: true,
});

schema.set("toJSON", {
    transform: (_: any, ret: any, __: any) => {
        delete ret.id;
        ret[InfographicDocument.banner] = `${BASE_URL}uploads/${ret[InfographicDocument.banner]}`;

        return ret;
    },

    virtuals: true,
});

export default mongoose.model<IInfographic>(InfographicDocument.schemaName, schema);
