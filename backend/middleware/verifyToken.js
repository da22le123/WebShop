import jwt from "jsonwebtoken";
import { User } from "../data/database.js";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });

        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) return res.status(401).json({ message: "Invalid token" });

        req.user = {
            id: user.id,
            username: user.username,
        };

        next();
    });
};
