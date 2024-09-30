import express from "express";
import devRoutes from "./routes/ping";
import booksRoutes from "./routes/books";

const app = express();
const bdd = process.env.BDD || "mongodb";

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

export default app;
