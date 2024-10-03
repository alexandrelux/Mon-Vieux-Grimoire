import express from "express";
import {
    createBookSQL,
    createRatingSQL,
    deleteBookSQL,
    getAllBookSQL,
    getBestRatingBookSQL,
    getOneBookSQL,
    modifyBookSQL,
} from "../controllers/booksSQL";
import {
    createBook,
    createRating,
    deleteBook,
    getAllBook,
    getBestRatingBook,
    getOneBook,
    modifyBook,
} from "../controllers/books";
import { auth } from "../middleware/auth";
import multer from "../middleware/multer-config";

const router = express.Router();
const bdd = process.env.BDD || "mongodb";

if (bdd === "postgresql") {
    router.post("/", auth, multer, createBookSQL);
    router.post("/:id/rating", auth, createRatingSQL);
    router.get("/", getAllBookSQL);
    router.get("/bestrating/", getBestRatingBookSQL);
    router.get("/:id", getOneBookSQL);
    router.put("/:id", auth, multer, modifyBookSQL);
    router.delete("/:id", auth, deleteBookSQL);
} else {
    router.post("/", auth, multer, createBook);
    router.post("/:id/rating", auth, createRating);
    router.get("/", getAllBook);
    router.get("/bestrating/", getBestRatingBook);
    router.get("/:id", getOneBook);
    router.put("/:id", auth, multer, modifyBook);
    router.delete("/:id", auth, deleteBook);
}

export default router;
