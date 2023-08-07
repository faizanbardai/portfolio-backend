import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import dotenv from "dotenv";

const urlSchema = new Schema({
  originalURL: {
    type: String,
    required: true,
  },
  shortURL: String,
});

dotenv.config();
const uri = process.env.SHORT_URL_URI;

if (!uri) {
  throw new Error("MongoDB URI not found");
}

mongoose.connect(uri);

export default model("url", urlSchema);
