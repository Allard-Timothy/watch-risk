import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/email";

import { sendMagicLink } from "@/lib/email";
import { getDbClient } from "@/lib/db";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(getDbClient()),
  providers: [
    EmailProvider({
      server:
        process.env.EMAIL_SERVER ??
        "smtp://dev:dev@localhost:1025?secure=false",
      from: process.env.EMAIL_FROM ?? "WatchTell <no-reply@localhost>",
      sendVerificationRequest: async ({ identifier, url }) => {
        await sendMagicLink({ to: identifier, url });
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
  session: {
    strategy: "database",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
