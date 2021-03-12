import * as dotEnv from "dotenv";

dotEnv.config();

export enum Mode {
    dev = "dev",
    pro = "pro",
}

export const MODE = (process.env.MODE as unknown) as Mode;
export const PORT = (process.env.PORT as unknown) as number;
export const BASE_URL = (process.env.BASE_URL as unknown) as string;
export const DB_URL = (process.env.DB_URL as unknown) as string;
export const TOKEN_SECRED = (process.env.TOKEN_SECRED as unknown) as string;
export const ENC_SALT = (process.env.ENC_SALT as unknown) as string;
