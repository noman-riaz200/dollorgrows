import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
NEXTAUTH_URL: z.string().url(),
  NEXT_PUBLIC_BSC_RPC_URL: z.string().url(),
  NEXT_PUBLIC_BEP20_TOKEN_ADDRESS: z.string().optional(),
  NEXT_PRIVATE_WALLET_PRIVATE_KEY: z.string().optional(),
  NEXT_PUBLIC_LEVEL1_COMMISSION: z.string().default("10"),
  NEXT_PUBLIC_LEVEL2_COMMISSION: z.string().default("5"),
  NEXT_PUBLIC_LEVEL3_COMMISSION: z.string().default("3"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration");
  }

  return result.data;
}

export const env = validateEnv();
