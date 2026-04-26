import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          referralCode: user.referralCode,
          role: user.role as "user" | "admin",
          country: user.country,
          phone: user.phone,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Auto-create user for Google sign-in
          const newUser = await prisma.user.create({
            data: {
              name: user.name || user.email.split("@")[0],
              email: user.email!,
              password: await bcrypt.hash(Math.random().toString(36), 12),
              securityPin: "0000",
              wallet: {
                create: {},
              },
            },
          });
          user.id = newUser.id;
          user.referralCode = newUser.referralCode;
          user.role = newUser.role;
          user.country = newUser.country;
          user.phone = newUser.phone;
        } else {
          user.id = existingUser.id;
          user.referralCode = existingUser.referralCode;
          user.role = existingUser.role;
          user.country = existingUser.country;
          user.phone = existingUser.phone;
        }
      }
      return true;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.referralCode = user.referralCode;
        token.role = user.role;
        token.country = user.country;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id || token.sub!;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.referralCode = token.referralCode as string;
        session.user.role = token.role as string;
        session.user.country = token.country as string;
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

