import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getUserCartProducts, addProductToCart, removeProductFromCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.get("/", verifyToken, getUserCartProducts);
cartRouter.post("/", verifyToken, addProductToCart);
cartRouter.delete("/", verifyToken, removeProductFromCart);

export { cartRouter };

