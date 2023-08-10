import URLModel from "../db/models/url";

export const isLongURLShortURL = async (url: string) => {
  const alias = url.replace((process.env.BASE_URL as string) + "/su/", "");
  const exist = await URLModel.exists({ shortURL: alias });
  return exist;
};
