import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role?: "user" | "admin";
      referralCode?: string;
      country?: string | null;
      phone?: string | null;
      avatar?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    name: string;
    email: string;
    role?: "user" | "admin";
    referralCode?: string;
    country?: string | null;
    phone?: string | null;
    avatar?: string | null;
  }
}

