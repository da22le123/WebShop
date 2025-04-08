import { Product } from "../data/database.js";

export const getAllProducts = async (req, res) => {
    const products = await Product.findAll();
    res.status(200).json(products);
}