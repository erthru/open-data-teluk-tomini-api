import mongoose, { Document, Schema } from "mongoose";
import { BASE_URL } from "../helpers/environments";
import { v4 as uuidV4 } from "uuid";

export enum CategoryDocument {
    schemaName = "category",
    name = "name",
    icon = "icon",
}

interface ICategory extends Document {
    [CategoryDocument.name]?: string;
    [CategoryDocument.icon]?: string;
}

const schema = new Schema(
    {
        _id: {
            type: String,
            default: uuidV4,
        },

        [CategoryDocument.name]: {
            type: String,
            unique: true,
            required: true,
        },

        [CategoryDocument.icon]: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

schema.set("toJSON", {
    transform: (_: any, ret: any, __: any) => {
        delete ret.id;
        ret[CategoryDocument.icon] = BASE_URL + "uploads/" + ret[CategoryDocument.icon];

        return ret;
    },
});

export default mongoose.model<ICategory>(CategoryDocument.schemaName, schema);
