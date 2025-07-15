import "express-async-errors";
import express from "express";
import { authRouter } from "./routes/authRouter.js";
import { productsRouter } from "./routes/productsRouter.js";
import { cartRouter } from "./routes/cartRouter.js";
import { usersRouter } from "./routes/usersRouter.js";

/**
 * Handle any error coming from the Express application.
 * @param {any} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function errorHandler(err, req, res, next) {
    console.error(err);
    if (err.name === "ValidationError") {
        return res.status(400).json({
            error: "Validation error",
            errors: err.errors,
        });
    }

    res.status(500).json({ error: "Something went wrong!" });
}

export function createServerApp() {
    const app = express();

    app.use(express.json());
    app.use("/tokens", authRouter);
    app.use("/products", productsRouter);
    app.use("/cart", cartRouter);
    app.use("/users", usersRouter);

    app.use(errorHandler);

    return app;
}
