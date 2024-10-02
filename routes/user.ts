import express from "express";
import { loginSQL, signupSQL } from "../controllers/userSQL";
import { login, signup } from "../controllers/user";
const router = express.Router();
const bdd = process.env.BDD || "mongodb";

if (bdd === "postgresql") {
    router.post("/signup", signupSQL);
    router.post("/login", loginSQL);
} else {
    router.post("/signup", signup);
    router.post("/login", login);
}

export default router;
