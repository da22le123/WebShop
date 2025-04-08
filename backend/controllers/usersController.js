import bcrypt from "bcrypt";
import { User } from "../data/database.js";

export const createUser = async (req, res) => {
    const validatedData = await registerSchema.validate(req.body, {
        abortEarly: false,
    });

    const { username, password } = validatedData;

    const duplicateUser = await User.findOne({ where: { username } });

    if (duplicateUser)
        return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        password: hashedPassword,
    });

    res.status(201).json({ newUser });
}
