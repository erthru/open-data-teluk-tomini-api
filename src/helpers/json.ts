import { Response } from "express";

export const OK = (res: Response, data?: any) => {
    res.status(200).json({
        error: false,
        message: "OK",
        ...data,
    });
};

export const CREATED = (res: Response, data?: any) => {
    res.status(201).json({
        error: false,
        message: "CREATED",
        ...data,
    });
};

export const UNAUTHORIZED = (res: Response) => {
    res.status(401).json({
        error: true,
        message: "UNAUTHORIZED",
    });
};

export const ERROR = (res: Response, message: string) => {
    res.status(500).json({
        error: true,
        message: `ERROR: ${message}`,
    });
};
