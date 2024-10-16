import { Request, Response, NextFunction } from "express";
import Book from "../models/book";
import { average, checkGrade } from "../utils/functions";
import { promises as fs } from "fs";
import { IRating } from "../types/book";

export const createBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const bookObject = JSON.parse(req.body.book);
        delete bookObject._id;
        delete bookObject.userId;

        if (!req.auth || !req.file) {
            return res
                .status(400)
                .json({ message: "Authentication data or file missing!" });
        }

        // Verification la taille de l'array, doit être de 1 à la création
        const ratings: IRating[] = bookObject.ratings;
        if (ratings.length != 1) {
            return res.status(400).json({
                message: "Error rating tables incorrect",
            });
        } else {
            // Vérifie si le user est valide
            if (ratings[0].userId != req.auth.userId) {
                return res.status(403).json({ message: "Not authorized" });
            }
            // Vérifie si le rating est valide
            if (!checkGrade(ratings[0].grade)) {
                return res.status(400).json({
                    message: "Rating incorrect should be >=0 et <=5  !",
                });
            }
        }

        // Calcule l'averageRating
        const bookRatings = ratings.map((item) => item.grade);
        const averageRating = average(bookRatings);

        // Persist on the BDD
        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            averageRating: averageRating,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
            }`,
        });

        await book.save();
        return res.status(201).json({ message: "Book enregistré !" });
    } catch (error) {
        return res.status(400).json({ error });
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
            return res.status(400).json({
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
        return res.status(201).json(book);
    } catch (error) {
        return res.status(400).json({ error });
    }
};

export const getAllBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const books = await Book.find();
        return res.status(200).json(books);
    } catch (error) {
        return res.status(400).json({ error });
    }
};

export const getOneBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const book = await Book.findById({ _id: req.params.id });
        if (book == null) {
            return res.status(404).json("Not found");
        }
        return res.status(200).json(book);
    } catch (error) {
        return res.status(400).json({ error });
    }
};

export const getBestRatingBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const bestRatingBooks = await Book.find()
            .sort({ averageRating: -1 })
            .limit(3); // plus simple et performant car cela évite de parcour tous les livres de la BDD
        return res.status(200).json(bestRatingBooks);
    } catch (error) {
        return res.status(400).json({ error });
    }
};

export const modifyBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const bookObject = req.file
            ? {
                  ...JSON.parse(req.body.book),
                  imageUrl: `${req.protocol}://${req.get("host")}/images/${
                      req.file.filename
                  }`,
              }
            : req.body;
        delete bookObject.userId;

        // Il n’est pas possible de modifier une note.
        delete bookObject.ratings;
        delete bookObject.averageRating;

        const book = await Book.findOne({ _id: req.params.id });
        if (!book || !req.auth) {
            return res.status(401).json({ message: "Something goes wrong!" });
        }

        if (book.userId == req.auth.userId) {
            try {
                // Si nouvelle image supprimer l'ancienne
                if (req.file) {
                    const filename = book.imageUrl.split("/images/")[1];
                    await fs.unlink(`images/${filename}`);
                }

                // Persist on BDD
                await Book.updateOne(
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
                );
                return res.status(200).json({ message: "Objet modifié!" });
            } catch (error) {
                return res.status(500).json({ error });
            }
        } else {
            return res.status(403).json({ message: "Not authorized" }); // 403 != 401
        }
    } catch (error) {
        return res.status(400).json({ error });
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
                return res.status(200).json(book);
            } else {
                return res.status(403).json({ message: "Unauthorized" });
            }
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
};
