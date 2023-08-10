import { Request, Response } from "express";
import URLModel from "../../db/models/url";
import isValidUrl from "../../util/isValidUrl";
import dnsLookup from "../../util/dnsLookup";
import generateAlias from "../../util/generateAlias";

const create = async (req: Request, res: Response) => {
  const { url: originalURL } = req.body;

  if (!isValidUrl(originalURL)) {
    return res.status(400).json({ message: "Invalid URL" });
  }

  const url = new URL(originalURL);

  const dnsLookupResponse = await dnsLookup(url.hostname);

  if (!dnsLookupResponse) {
    return res.status(400).json({ message: "Invalid URL" });
  }

  const documents = await URLModel.find({ originalURL: url.href });

  if (documents.length) {
    const { alias } = req.body;
    if (!alias) {
      return res.json(documents);
    } else {
      const aliasExists = await URLModel.exists({ shortURL: alias });
      if (aliasExists) {
        return res.status(400).json({ message: "Alias already exists" });
      }
      const newDocument = await URLModel.create({
        shortURL: alias,
        originalURL: url.href,
      });
      documents.push(newDocument);
      return res.json(documents);
    }
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
  res.json([urlObject]);
};

export default create;
