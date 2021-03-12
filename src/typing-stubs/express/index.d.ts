import "express";
import { AuthVerified } from "../../middlewares/check-auth";

declare global {
    namespace Express {
        interface Request {
            authVerified: AuthVerified;
        }
    }
}
