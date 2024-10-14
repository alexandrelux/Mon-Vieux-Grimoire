import { Request, Response, NextFunction } from "express";
import { User } from "../models/userSQL";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signupSQL = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10); // 10 cycle bon compromis entre securite et temps

        const user = User.build({
            email: req.body.email,
            password: hash,
        });
        try {
            await user.save();
            return res.status(201).json({ message: "Utilisateur créé !" });
        } catch (error) {
            return res.status(400).json({ error });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export const loginSQL = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Paire login/mot de passe incorrecte" });
        } else {
            try {
                const valid = await bcrypt.compare(
                    req.body.password,
                    user.dataValues.password
                );
                if (!valid) {
                    return res.status(401).json({
                        message: "Paire login/mot de passe incorrecte",
                    });
                }
                return res.status(200).json({
                    userId: user.dataValues._id,
                    token: jwt.sign(
                        { userId: user.dataValues._id },
                        `${process.env.SECRET}`,
                        { expiresIn: "24h" }
                    ),
                });
            } catch (error) {
                return res.status(500).json({ error });
            }
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
};
