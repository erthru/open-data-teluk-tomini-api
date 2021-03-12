import { Response } from "express";

export const OK = (res: Response, data?: any, additionalMessage?: string) => {
    res.status(200).json({
        error: false,
        message: `OK ${additionalMessage}`,
        ...data,
    });
};

export const UNAUTHORIZED = (res: Response) => {
    res.status(401).json({
        error: true,
        message: "UNAUTHORIZED",
    });
};
