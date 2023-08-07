import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import shortURLRouter from "./projects/shortURL/routes";

dotenv.config();

const app: Express = express();

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => res.send("FayJu Portfolio"));

app.use("/su/api", shortURLRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
