import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import shortURLRouter from "./projects/shortURL/routes";
import { corsSU } from "./projects/shortURL/corsSU";

dotenv.config();

const app: Express = express();

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT;

app.get("/", cors(), (req: Request, res: Response) => {
  res.send("FayJu Portfolio");
});

app.use("/su", corsSU, shortURLRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
