import express from "express";
import User from "./user.js";
import File from "./file.js";
import { authenticateUser } from "../middleware/authUser.js";

const routes = express();

routes.use("/", User);
routes.use("/", authenticateUser, File);

export default routes;
