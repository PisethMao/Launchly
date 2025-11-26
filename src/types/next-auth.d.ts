import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    plan?: string;
    role?: string;
  }
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan?: string;
      role?: string;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    plan?: string;
    role?: string;
  }
}
