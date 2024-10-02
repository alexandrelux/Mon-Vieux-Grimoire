import express from "express";
import devRoutes from "./routes/ping";
import mongoose from "mongoose";
import { Sequelize } from "sequelize";
import booksRoutes from "./routes/books";
import userRoutes from "./routes/user";

const app = express();
const bdd = process.env.BDD || "mongodb";

if (bdd === "postgresql") {
    const sequelize = new Sequelize(`${process.env.POSTGREURL}`);

    sequelize
        .authenticate()
        .then(() => console.log("Connexion à PostgreSQL réussie !"))
        .catch(() => console.error("Connexion à PostgreSQL échouée !"));
} else {
    const mongoURI = process.env.MONGODBURL;

    mongoose
        .connect(`${mongoURI}`, {})
        .then(() => console.log("Connexion à MongoDB réussie !"))
        .catch(() => console.error("Connexion à MongoDB échouée !"));
}

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.use("/api", devRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);

export default app;
