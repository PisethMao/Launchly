"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  return {
    session,
    status,
    signIn,
    signOut,
    isAuthed: status === "authenticated",
  };
}
