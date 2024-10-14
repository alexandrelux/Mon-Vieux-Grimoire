import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "No token provided" });
        }
        const token = req.headers.authorization.split(" ")[1]; // After "Bearer "
        const decodedToken = jwt.verify(
            token,
            `${process.env.SECRET}`
        ) as jwt.JwtPayload;
        const userId = decodedToken.userId;
        if (!userId) {
            return res.status(401).json({ error: "Invalid token" });
        }
        req.auth = { userId };
        next();
    } catch (error) {
        return res.status(401).json({ error });
    }
};
