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

const router = express.Router();
const bdd = process.env.BDD || "mongodb";

if (bdd === "postgresql") {
    router.post("/", createBookSQL);
    router.post("/:id/rating", createRatingSQL);
    router.get("/", getAllBookSQL);
    router.get("/bestrating/", getBestRatingBookSQL);
    router.get("/:id", getOneBookSQL);
    router.put("/:id", modifyBookSQL);
    router.delete("/:id", deleteBookSQL);
} else {
    router.post("/", createBook);
    router.post("/:id/rating", createRating);
    router.get("/", getAllBook);
    router.get("/bestrating/", getBestRatingBook);
    router.get("/:id", getOneBook);
    router.put("/:id", modifyBook);
    router.delete("/:id", deleteBook);
}

export default router;
