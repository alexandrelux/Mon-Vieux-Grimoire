import mongoose, { Schema } from "mongoose";
import { IBook } from "../types/book";

const bookSchema: Schema = new Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
            userId: { type: String, required: true },
            grade: { type: Number, required: true },
        },
    ],
    averageRating: { type: Number, required: false },
});

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
