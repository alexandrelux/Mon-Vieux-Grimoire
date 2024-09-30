import { Request, Response, NextFunction } from "express";
import Book from "../models/book";
import {
    average,
    bestRatingBookFromData,
    checkGrade,
} from "../utils/functions";

export const createBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    delete req.body._id;
    const book = new Book({
        ...req.body,
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
        const { userId, rating } = req.body;

        // Vérifie si le rating est valide
        if (checkGrade(rating)) {
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
            }); // TODO userId

            // Recalcule l'averageRating
            const bookRatings = book.ratings.map((item) => item.grade);
            book.averageRating = average(bookRatings);

            // Mets à jour le livre avec le nouvel averageRating
            await book.save();
            res.status(201).json(book.ratings.pop());
        } else {
            res.status(400).json({
                message: "Rating incorrect should be >=0 ou <=5  !",
            });
        }
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
    try {
        await Book.updateOne(
            { _id: req.params.id },
            { ...req.body, _id: req.params.id }
        );
        res.status(200).json({ message: "Objet modifié !" });
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
        const book = await Book.deleteOne({ _id: req.params.id });
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ error });
    }
};
