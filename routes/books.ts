import express from "express";
import { createBookSQL, getAllBookFromSQL } from "../controllers/booksSQL";
import { createBook, getAllBook } from "../controllers/books";

const router = express.Router();
const bdd = process.env.BDD || "mongodb";

if (bdd === "postgresql") {
    router.get("/", getAllBookFromSQL);
    router.post("/", createBookSQL);
} else {
    router.get("/", getAllBook);
    router.post("/", createBook);
}

export default router;
