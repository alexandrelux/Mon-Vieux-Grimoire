import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10); // 10 cycle bon compromis entre securite et temps
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        try {
            await user.save();
            res.status(201).json({ message: "Utilisateur créé !" });
        } catch (error) {
            res.status(400).json({ error });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Paire login/mot de passe incorrecte" });
        } else {
            try {
                const valid = await bcrypt.compare(
                    req.body.password,
                    user.password
                );
                if (!valid) {
                    return res.status(401).json({
                        message: "Paire login/mot de passe incorrecte",
                    });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        `${process.env.SECRET}`,
                        { expiresIn: "24h" }
                    ),
                });
            } catch (error) {
                res.status(500).json({ error });
            }
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};
