import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      walletAddress: string;
      username?: string;
      fullName?: string;
      role?: "user" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    walletAddress: string;
    username?: string;
    fullName?: string;
    role?: "user" | "admin";
  }
}
