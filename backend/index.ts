import dotenv from "dotenv";
import app from "./app";
import { API_PORT } from "./env";
import { connectPgClient } from "./db";

dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error("Required environment variable is missing: DATABASE_URL");
}

connectPgClient();

const port = API_PORT ?? 3000;
app.listen(port, () => {
  console.log(`App started on http://localhost:${port}`);
});

export default app;