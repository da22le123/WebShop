import { Product } from "../data/database.js";
import { productSchema } from "../schemas.js";
import { Op } from "sequelize";

export const getAllProducts = async (req, res) => {
    try {
      const searchTerm = req.query.search || '';
      
      let products;
      if (searchTerm) {
        products = await Product.findAll({
          where: {
            name: {
              [Op.like]: `%${searchTerm}%`
            }
          }
        });
      } else {
        // Otherwise, return all products.
        products = await Product.findAll();
      }
      
      res.status(200).json(products);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

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