"use client";

import { signOut, useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  const isAuthed = status == "authenticated";
  return {
    session,
    signOut,
    isAuthed,
  };
}
