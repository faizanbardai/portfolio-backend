import cors from "cors";

// Short URL
export const corsSU = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const whitelist = process.env.SHORT_URL_FRONTEND!.split(",");
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
});
