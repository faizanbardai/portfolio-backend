import { Request, Response } from "express";
import URLModel from "../../db/models/url";
import isValidUrl from "../../util/isValidUrl";
import dnsLookup from "../../util/dnsLookup";
import generateAlias from "../../util/generateAlias";
import { isLongURLShortURL } from "../../util/isLongURLShortURL";

const create = async (req: Request, res: Response) => {
  const { url: originalURL } = req.body;

  if (!isValidUrl(originalURL)) {
    return res.status(400).json({ message: "Invalid URL" });
  }

  const urlData = {
    host: "",
    port: "",
    pathname: "",
    search: "",
    hash: "",
    ip: "",
    protocol: "",
    params: "",
  };

  let url: URL;
  try {
    url = new URL(originalURL);
    urlData.host = url.host;
    urlData.port = url.port;
    urlData.pathname = url.pathname;
    urlData.search = url.search;
    urlData.hash = url.hash;
    urlData.protocol = url.protocol;
    urlData.params = url.search;
  } catch (error) {
    return res.status(400).json({ message: "Invalid URL" });
  }

  let address, family;
  try {
    ({ address, family } = await dnsLookup(url.hostname));
    urlData.ip = address;
  } catch (error) {
    return res.status(400).json({ message: "Invalid URL" });
  }

  const longURLisShortURL = await isLongURLShortURL(url.href);

  if (longURLisShortURL) {
    return res
      .status(400)
      .json({ message: "You have entered an existing short URL." });
  }

  const documents = await URLModel.find({ originalURL: url.href });

  if (documents.length) {
    const { alias } = req.body;
    if (!alias) {
      return res.json({ url: urlData, documents });
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
      return res.json({ url: urlData, documents });
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
  res.json({ url: urlData, documents: [urlObject] });
};

export default create;
