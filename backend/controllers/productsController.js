import { Product } from "../data/database.js";
import { productSchema } from "../schemas.js";

export const getAllProducts = async (req, res) => {
    const products = await Product.findAll();
    res.status(200).json(products);
}

export const addProduct = async (req, res) => {
    const validatedData = await productSchema.validate(req.body, {
        abortEarly: false,
    });

    const { name, price } = validatedData;

    try {
        const newProduct = await Product.create({
            name,
            price
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}