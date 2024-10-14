import { Request, Response, NextFunction } from "express";

export const pong = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json("pong");
};

export const pongSQL = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json("pong SQL");
};
