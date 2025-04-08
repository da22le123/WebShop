import express from "express";
import { createUser } from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.post("/", createUser);

export { usersRouter };