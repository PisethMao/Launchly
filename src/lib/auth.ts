import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (email === "demo@launchly.app" && password === "demo123") {
          return {
            id: "u_demo",
            name: "Launchly Demo",
            email: "demo@launchly.app",
            image: "https://www.gravatar.com/avatar/?d=identicon",
            plan: "Free",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.plan = user.plan ?? "Free";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.plan = token.plan ?? "Free";
      return session;
    },
  },
};
