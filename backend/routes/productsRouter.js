import express from "express";
import { getAllProducts, addProduct } from "../controllers/productsController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const productsRouter = express.Router();

productsRouter.get("/", getAllProducts);
productsRouter.post("/", verifyToken, addProduct);

export { productsRouter };

