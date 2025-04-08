import { loginSchema } from "../schemas.js"; 
import { User } from "../data/database.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const handleLogin = async (req, res, next) => {
    const validatedData = await loginSchema.validate(req.body, {
        abortEarly: false,
    });

    const { username, password } = validatedData;

    const foundUser = await User.findOne({ where: { username } });
    if (!foundUser)
        return res.status(401).json({ message: "Invalid credentials!" });

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match)
        return res.status(401).json({ message: "Invalid credentials!" });

    const token = jwt.sign(
        {
            id: foundUser.id,
            username: foundUser.username,
        },
        process.env.JWT_SECRET,
    );
    res.status(200).json({ token });
};
