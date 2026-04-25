import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Wallet",
      credentials: {
        walletAddress: { label: "Wallet Address", type: "text" },
        signature: { label: "Signature", type: "text" },
        message: { label: "Message", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.walletAddress) {
          return null;
        }

        const { walletAddress } = credentials as {
          walletAddress: string;
        };

        // TODO: Implement signature verification in production
        // const { signature, message } = credentials;

        // Check if user exists by wallet address
        let user = await prisma.user.findUnique({
          where: { walletAddress },
        });

        // If user doesn't exist, create new one
        if (!user) {
          const username = `User_${walletAddress.slice(2, 10)}`;
          const referralCode = `REF${walletAddress.slice(2, 10).toUpperCase()}`;

          user = await prisma.user.create({
            data: {
              walletAddress,
              username,
              referralCode,
              totalInvested: 0,
              totalEarnings: 0,
              availableBalance: 0,
            },
          });
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          image: null,
          walletAddress: user.walletAddress,
          username: user.username,
          fullName: user.fullName,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.walletAddress = user.walletAddress;
        token.username = user.username;
        token.fullName = user.fullName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.walletAddress = token.walletAddress as string;
        session.user.username = token.username as string;
        session.user.fullName = token.fullName as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
