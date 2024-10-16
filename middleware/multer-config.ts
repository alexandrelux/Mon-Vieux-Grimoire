import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { removeLastDot } from "../utils/functions";

const MIME_TYPES: { [key: string]: string | undefined } = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
};

// https://stackoverflow.com/questions/59097119/using-multer-diskstorage-with-typescript
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        callback: DestinationCallback
    ) => {
        callback(null, "tmp");
    },
    filename: (
        req: Request,
        file: Express.Multer.File,
        callback: FileNameCallback
    ) => {
        const nameWithoutExtension = removeLastDot(file.originalname);
        const name = nameWithoutExtension.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        if (extension !== undefined) {
            callback(null, `${name}-${Date.now()}.${extension}`);
        } else {
            callback(new Error("Unsupported file type"), "");
        }
    },
});

const upload = multer({ storage }).single("image");

const convertToWebp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.file) {
        const inputPath = req.file.path;
        const fileNameWithoutExtension = removeLastDot(req.file.filename);
        const outputPath = path.join(
            "images",
            `${fileNameWithoutExtension}.webp`
        );

        try {
            await sharp(inputPath)
                .resize(800) // .resize(largeur, hauteur) or .resize(null, h)
                .toFormat("webp")
                .toFile(outputPath);

            fs.unlinkSync(inputPath);

            req.file.path = outputPath;
            req.file.filename = path.basename(outputPath);

            next();
        } catch (err) {
            next(err);
        }
    } else {
        // Ce n'est pas forcément une erreur la modification d'un image n'est pas mandatory lors du PUT
        next();
    }
};

export { upload, convertToWebp };
