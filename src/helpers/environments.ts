import * as dotEnv from "dotenv";

dotEnv.config();

export enum Mode {
    dev = "dev",
    pro = "pro",
}

export const MODE = (process.env.MODE as unknown) as Mode;
export const PORT = parseInt((process.env.PORT as unknown) as string);
export const BASE_URL = (process.env.BASE_URL as unknown) as string;
export const DB_URL = (process.env.DB_URL as unknown) as string;
export const TOKEN_SECRET = (process.env.TOKEN_SECRET as unknown) as string;
export const SEEDER_PASSWORD = (process.env.SEEDER_PASSWORD as unknown) as string;
export const HASH_SALT_ROUND = parseInt((process.env.HASH_SALT_ROUND as unknown) as string);
