import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma"; // Adjust this import based on your Prisma client setup

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.hasRegister = user.hasRegister;
        token.country = user.country;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.hasRegister = token.hasRegister as boolean;
        session.user.country = token.country as string;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        let user = await prisma.user.findUnique({
          where: { email: profile?.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile?.email!,
              name: profile?.name!,
              country: "",
              hasRegister: false,
              accounts: {
                create: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  type: account.type,
                  access_token: account.access_token,
                  token_type: account.token_type,
                  id_token: account.id_token,
                  scope: account.scope,
                },
              },
            },
          });
        }

        // Always return true to establish the session
        return true;
      }
      return true;
    },
  },
  events: {
    async signIn({ user }) {
      // Check if user needs to complete registration
      if (!user?.hasRegister) {
        // We'll handle the redirect on the client side
        user.needsRegistration = true;
      }
    },
  },
});

export { handler as GET, handler as POST };
