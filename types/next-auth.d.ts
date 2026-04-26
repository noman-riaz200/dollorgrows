import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role?: "user" | "admin";
      referralCode?: string;
    } & DefaultSession["user"];
  }

  interface User {
    name: string;
    email: string;
    role?: "user" | "admin";
    referralCode?: string;
  }
}

