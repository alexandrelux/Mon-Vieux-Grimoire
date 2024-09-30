import express from "express";
import { pong, pongSQL } from "../controllers/pong";

const router = express.Router();
const bdd = process.env.BDD || "mongodb";

if (bdd === "postgresql") {
    router.get("/ping", pongSQL);
} else {
    router.get("/ping", pong);
}

export default router;
