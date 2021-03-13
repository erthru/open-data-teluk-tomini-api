import CryptoJS from "crypto-js";
import { ENC_SECRET } from "./environments";

export const encrypt = (plain: string): string => CryptoJS.AES.encrypt(plain, ENC_SECRET).toString();

export const decrypt = (chiper: string): string => {
    const bytes = CryptoJS.AES.decrypt(chiper, ENC_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
};
