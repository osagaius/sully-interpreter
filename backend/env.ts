import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config());

export const API_PORT = process.env.API_PORT;
export const DATABASE_URL = process.env.DATABASE_URL;
