import { Request, Response, NextFunction } from "express";
import { Book, Rating } from "../models/bookSQL";
import { IBook } from "../types/book";
import {
    average,
    bestRatingBookFromData,
    checkGrade,
} from "../utils/functions";
import { promises as fs } from "fs";

export const createBookSQL = async (
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

    const book = Book.build({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
    });
    try {
        await book.save();

        // Crée un nouveau rating
        await Rating.create({
            userId: req.auth.userId,
            grade: bookObject.ratings[0].grade,
            bookId: book.dataValues._id,
        });

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
        const { rating } = req.body;

        if (!req.auth) {
            return res
                .status(400)
                .json({ message: "Authentication data missing!" });
        }
        const userId = req.auth.userId; // userID du token

        // Vérifie si le rating est valide
        if (!checkGrade(rating)) {
            res.status(400).json({
                message: "Rating incorrect should be >=0 ou <=5 !",
            });
        }

        // Cherche le livre dans la BDD
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
        await Rating.create({
            userId: userId,
            grade: rating,
            bookId: bookId, // Associe le rating à la table Book
        });

        // Recalcule l'averageRating
        const updatedRatings = await Rating.findAll({ where: { bookId } });
        const ratingValues = updatedRatings.map((r) => r.dataValues.grade);
        const averageRating = average(ratingValues);

        // Mets à jour le livre avec le nouvel averageRating
        await book.update({ averageRating });

        // Renvoie le livre
        const bookUpdated = await Book.findByPk(bookId, {
            include: [{ model: Rating, as: "ratings" }],
        });
        res.status(201).json(bookUpdated);
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
        const book = await Book.findByPk(req.params.id);
        if (!book || !req.auth) {
            return res.status(500).json({ message: "Something goes wrong!" });
        }

        if (book.dataValues.userId == req.auth.userId) {
            try {
                // Si nouvelle image supprimer l'ancienne
                if (req.file) {
                    const filename =
                        book.dataValues.imageUrl.split("/images/")[1];
                    await fs.unlink(`images/${filename}`);
                }

                // Persist on BDD
                await book.update({
                    ...bookObject,
                });
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

export const deleteBookSQL = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book || !req.auth) {
            return res.status(500).json({ message: "Something goes wrong!" });
        }

        if (book) {
            if (book.dataValues.userId === req.auth.userId) {
                // Delete image on file system
                const filename = book.dataValues.imageUrl.split("/images/")[1];
                await fs.unlink(`images/${filename}`);
                // Delete Book on DB
                const result = await Book.destroy({
                    where: {
                        _id: req.params.id,
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
            }
        } else {
            res.status(400).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};
