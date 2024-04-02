import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import morgan from "morgan";

import { corsSU } from "./projects/shortURL/corsSU";
import shortURLRouter from "./projects/shortURL/routes";

dotenv.config();

const app: Express = express();

// parse application/json
app.use(bodyParser.json());

// morgan
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

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
