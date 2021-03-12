import mongoose, { Document, Schema } from "mongoose";
import { BASE_URL } from "../helpers/environments";

export enum OrganizationDocument {
    schemaName = "organization",
    name = "name",
    description = "description",
    photo = "photo",
    authId = "authId",
}

interface IOrganization extends Document {
    [OrganizationDocument.name]?: string;
    [OrganizationDocument.description]?: string;
    [OrganizationDocument.photo]?: string;
    [OrganizationDocument.authId]?: string;
}

const schema = new Schema(
    {
        [OrganizationDocument.name]: {
            type: String,
            required: true,
        },

        [OrganizationDocument.description]: {
            type: String,
        },

        [OrganizationDocument.photo]: {
            type: String,
            required: true,
        },

        [OrganizationDocument.authId]: {
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
        ret[OrganizationDocument.photo] = BASE_URL + "uploads/" + ret[OrganizationDocument.photo];

        return ret;
    },
});

export default mongoose.model<IOrganization>(OrganizationDocument.schemaName, schema);