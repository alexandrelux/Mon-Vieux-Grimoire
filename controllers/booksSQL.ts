import { Request, Response, NextFunction } from "express";

export const getAllBookFromSQL = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const stuff = [
        {
            _id: "oeihfzeoi",
            title: "Mon premier objet",
            description: "Les infos de mon premier objet",
            imageUrl:
                "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
            price: 4900,
            userId: "qsomihvqios",
        },
        {
            _id: "oeihfzeomoihi",
            title: "Mon deuxième objet",
            description: "Les infos de mon deuxième objet",
            imageUrl:
                "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
            price: 2900,
            userId: "qsomihvqios",
        },
    ];
    res.status(200).json(stuff);
};

export const createBookSQL = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(req.body);
    res.status(201).json({
        message: "Objet SQL créé !",
    });
};
