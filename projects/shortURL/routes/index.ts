import express from "express";
import { get, create } from "../controllers/url";

const shortURLRouter = express.Router();

shortURLRouter.post("/", create);
shortURLRouter.get("/:shortURL", get);

export default shortURLRouter;
