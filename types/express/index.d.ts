// types/express/index.d.ts
import "express";

declare module "express" {
    interface Request {
        auth?: { userId: string };
        file?: { filename: string };
    }
}
