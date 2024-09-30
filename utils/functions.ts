import { IBook } from "../types/book";

export const checkGrade = (i: number) => {
    if (i >= 0 || i <= 5) {
        return true;
    } else return false;
};

export const average = (numbers: number[]) => {
    const sum = numbers.reduce((a, b) => {
        return a + b;
    });
    const average = sum / numbers.length;
    return average;
};

export const bestRatingBookFromData = (books: IBook[]) => {
    const booksSorted = books.sort((a, b) => {
        return b.averageRating - a.averageRating;
    });
    const booksSorted3rnd = books.filter((item, key) => {
        if (key <= 2) return item;
    });
    return booksSorted3rnd;
};
