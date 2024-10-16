export interface IBook {
    userId: string;
    title: string;
    author: string;
    imageUrl: string;
    year: number;
    genre: string;
    ratings: IRating[];
    averageRating: number;
}

export interface IRating {
    userId: string;
    grade: 0 | 1 | 2 | 3 | 4 | 5;
}
