import express from "express";
import User from "./user.js";
import File from "./file.js";

const routes = express();

routes.use("/", User);
routes.use("/", File);

export default routes;
