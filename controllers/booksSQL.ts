import { Request, Response, NextFunction } from "express";
import { Book, Rating } from "../models/bookSQL";
import { IBook } from "../types/book";
import {
    average,
    bestRatingBookFromData,
    checkGrade,
} from "../utils/functions";

export const createBookSQL = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    delete req.body._id;
    const book = Book.build(req.body);
    try {
        await book.save();
        res.status(201).json({ message: "Book SQL enregistré !" });
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const createRatingSQL = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const bookId = req.params.id;
        const { userId, rating } = req.body;

        // Vérifie si le rating est valide
        if (checkGrade(rating)) {
            const book = await Book.findByPk(bookId, {
                include: [{ model: Rating, as: "ratings" }],
            });
            if (!book) {
                return res.status(404).json({ message: "Livre non trouvé !" });
            }

            // Vérifie si l'utilisateur a déjà noté ce livre
            const bookCommentedByUser = book.dataValues.ratings.find(
                (item: { userId: string; grade: 0 | 1 | 2 | 3 | 4 | 5 }) =>
                    item.userId === userId
            );
            if (bookCommentedByUser) {
                return res.status(200).json({ message: "Livre déjà noté" });
            }

            // Crée un nouveau rating
            const userIdAndRating = await Rating.create({
                userId: userId,
                grade: rating,
                bookId: bookId, // Associe le rating au livre
            });

            // Recalcule l'averageRating
            const updatedRatings = await Rating.findAll({ where: { bookId } });
            const ratingValues = updatedRatings.map((r) => r.dataValues.grade);
            const averageRating = average(ratingValues);

            // Mets à jour le livre avec le nouvel averageRating
            await book.update({ averageRating });
            res.status(201).json(userIdAndRating.dataValues);
        } else {
            res.status(400).json({
                message: "Rating incorrect, il doit être >= 0 et <= 5 !",
            });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const getAllBookSQL = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const books = await Book.findAll({
            include: [{ model: Rating, as: "ratings" }],
        });
        res.status(200).json(books);
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const getOneBookSQL = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const book = await Book.findByPk(req.params.id, {
            include: [{ model: Rating, as: "ratings" }],
        });
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const getBestRatingBookSQL = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const books = await Book.findAll();
        const myBook = books.map((item) => {
            return item.dataValues as IBook;
        });
        const bestRatingBooks = bestRatingBookFromData(myBook);
        res.status(200).json(bestRatingBooks);
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const modifyBookSQL = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        delete req.body._id;
        const book = await Book.findByPk(req.params.id);
        await book?.update({
            ...req.body,
        });
        res.status(200).json({ message: "Objet modifié !" });
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const deleteBookSQL = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const books = await Book.findByPk(req.params.id);
        const result = await Book.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (result === 0) {
            res.status(200).json({
                acknowledged: true,
                deletedCount: 0,
            });
        } else {
            res.status(200).json({
                acknowledged: true,
                deletedCount: 1,
            });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};
