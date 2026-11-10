import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Next.js reads .env.local at runtime; load the same file for Drizzle CLI commands.
config({ path: ".env.local" });
// Also support a conventional .env file without overriding .env.local values.
config();

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
