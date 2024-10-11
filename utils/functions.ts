import { IBook } from "../types/book";

export const checkGrade = (i: number) => {
    if (i >= 0 && i <= 5) {
        return true;
    } else return false;
};

export const average = (numbers: number[] | undefined) => {
    if (numbers) {
        const sum = numbers.reduce((a, b) => {
            return a + b;
        });
        const average = sum / numbers.length;
        return average;
    } else {
        // Initialise la note moyenne du livre à 0
        return 0;
    }
};

export const bestRatingBookFromData = (books: IBook[]) => {
    const booksSorted = books.sort((a, b) => {
        return b.averageRating - a.averageRating;
    });
    const booksSorted3rnd = booksSorted.filter((item, key) => {
        if (key <= 2) return item;
    });
    return booksSorted3rnd;
};

// https://stackoverflow.com/questions/29825464/javascript-split-split-string-by-last-dot
export const removeLastDot = (str: string) => {
    var arr = str.split("."); // Split the string using dot as separator
    var lastVal = arr.pop(); // Get last element
    var firstVal = arr.join("."); // Re-join the remaining substrings, using dot as separator
    return firstVal;
};
