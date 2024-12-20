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
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/signup", // Add this to redirect new users
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // To access user id later
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: profile?.email },
        });

        if (!existingUser) {
          // Redirect to signup if user doesn't exist
          return `/signup?email=${profile?.email}`;
        }
      }

      return true; // Continue sign-in process
    },
  },
});

export { handler as GET, handler as POST };
