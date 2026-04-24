import dotenv from "dotenv";
import { z } from "zod";
import { AppConfig } from "../types/app-config";

dotenv.config();

const envSchema = z.object({
  APP_PORT: z.coerce.number().int().positive().default(3010),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  ENTITY1_SERVICE_URL: z.string().url("ENTITY1_SERVICE_URL must be a valid URL"),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(5000)
});

export function getConfig(overrides?: Partial<AppConfig>): AppConfig {
  const parsed = envSchema.parse(process.env);

  return {
    port: overrides?.port ?? parsed.APP_PORT,
    mongodbUri: overrides?.mongodbUri ?? parsed.MONGODB_URI,
    entity1ServiceUrl: overrides?.entity1ServiceUrl ?? parsed.ENTITY1_SERVICE_URL,
    requestTimeoutMs: overrides?.requestTimeoutMs ?? parsed.REQUEST_TIMEOUT_MS
  };
}
