import "dotenv/config";

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV !== "production",
  databaseUrl: process.env.DATABASE_URL || "",
  weatherstackApiKey: process.env.WEATHERSTACK_API_KEY || "",
} as const;
