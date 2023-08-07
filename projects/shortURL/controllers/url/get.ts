import { Request, Response } from "express";
import URLModel from "../../db/models/url";

const get = async (req: Request, res: Response) => {
  const { shortURL } = req.params;
  const document = await URLModel.findOne({ shortURL });

  if (!document) {
    return res.status(404).send("Not Found");
  }

  res.redirect(document.originalURL);
};

export default get;
