import { Request, Response, NextFunction } from "express";
import Book from "../models/book";
import {
    average,
    bestRatingBookFromData,
    checkGrade,
} from "../utils/functions";
import { promises as fs } from "fs";

export const createBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject.userId;

    if (!req.auth || !req.file) {
        return res
            .status(400)
            .json({ message: "Authentication data or file missing!" });
    }
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
    });
    try {
        await book.save();
        res.status(201).json({ message: "Book enregistré !" });
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const createRating = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const bookId = req.params.id;
        const { rating } = req.body;

        if (!req.auth) {
            return res
                .status(400)
                .json({ message: "Authentication data missing!" });
        }
        const userId = req.auth.userId; // userID du tocken

        // Vérifie si le rating est valide
        if (!checkGrade(rating)) {
            res.status(400).json({
                message: "Rating incorrect should be >=0 et <=5  !",
            });
        }

        // Cherche le livre dans la BDD
        const book = await Book.findById({ _id: bookId });
        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé !" });
        }

        // Vérifie si l'utilisateur a déjà noté ce livre
        const bookCommentedByUser = book.ratings.find(
            (item) => item.userId === userId
        );
        if (bookCommentedByUser) {
            return res.status(200).json({ message: "Livre déjà noté" });
        }

        // Crée un nouveau rating
        book.ratings.push({
            userId: userId,
            grade: rating,
        });

        // Recalcule l'averageRating
        const bookRatings = book.ratings.map((item) => item.grade);
        book.averageRating = average(bookRatings);

        // Mets à jour le livre avec le nouvel averageRating
        await book.save();

        // Renvoie le livre
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const getAllBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const getOneBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const book = await Book.findById({ _id: req.params.id });
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const getBestRatingBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const books = await Book.find();
        const bestRatingBooks = bestRatingBookFromData(books);
        res.status(200).json(bestRatingBooks);
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const modifyBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : req.body;
    delete bookObject._userId;

    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (!book || !req.auth) {
            return res.status(500).json({ message: "Something goes wrong!" });
        }

        if (book.userId == req.auth.userId) {
            try {
                await Book.updateOne(
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
                );
                res.status(200).json({ message: "Objet modifié!" });
            } catch (error) {
                res.status(401).json({ error });
            }
        } else {
            res.status(401).json({ message: "Not authorized" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const deleteBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const book = await Book.findById({ _id: req.params.id });
        if (!book || !req.auth) {
            return res.status(500).json({ message: "Something goes wrong!" });
        }

        if (book) {
            if (book.userId === req.auth.userId) {
                // Delete image on file system
                const filename = book.imageUrl.split("/images/")[1];
                await fs.unlink(`images/${filename}`);
                // Delete Book on DB
                await Book.deleteOne({ _id: req.params.id });
                res.status(200).json(book);
            } else {
                res.status(401).json({ message: "Unauthorized" });
            }
        } else {
            res.status(400).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};
