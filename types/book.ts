export interface IBook {
    userId: string;
    title: string;
    author: String;
    imageUrl: string;
    year: number;
    genre: string;
    ratings: [
        {
            userId: string;
            grade: 0 | 1 | 2 | 3 | 4 | 5;
        }
    ];
    averageRating: number;
}
