import { Request, Response } from "express";
import URLModel from "../../db/models/url";
import isValidUrl from "../../../util/isValidUrl";
import dnsLookup from "../../../util/dnsLookup";
import generateAlias from "../../../util/generateAlias";

const create = async (req: Request, res: Response) => {
  const { url: originalURL } = req.body;

  if (!isValidUrl(originalURL)) {
    return res.status(400).send("Invalid URL");
  }

  const url = new URL(originalURL);

  const dnsLookupResponse = await dnsLookup(url.hostname);

  if (!dnsLookupResponse) {
    return res.status(400).send("Invalid URL");
  }

  const document = await URLModel.findOne({ originalURL: url.href });

  if (document) {
    return res.send(document);
  }

  let isNotNewAlias = true;
  let alias = "";
  do {
    alias = generateAlias();
    const documents = await URLModel.exists({ shortURL: alias });
    isNotNewAlias = !!documents;
  } while (isNotNewAlias);

  const urlObject = new URLModel({
    originalURL: url.href,
    shortURL: alias,
  });
  await urlObject.save();
  res.send(urlObject);
};

export default create;