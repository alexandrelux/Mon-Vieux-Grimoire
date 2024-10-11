// types/express/index.d.ts
import "express";
import { Multer } from "multer";

/*
https://www.npmjs.com/package/@types/multer
https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/multer/index.d.ts
*/
declare module "express" {
    interface Request {
        auth?: { userId: string };
        file?: Express.Multer.File;
    }
}
