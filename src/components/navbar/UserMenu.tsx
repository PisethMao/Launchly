import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function UserMenu() {
  const { isAuthed, session, signOut } = useAuth();
  if (!isAuthed) {
    return (
      <div className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:space-x-8">
        <Link
          href="/login"
          className="text-(--foreground) text-center hover:text-indigo-500 dark:hover:text-indigo-400 transition px-3 py-1.5 rounded-lg border dark:border-gray-70"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="text-(--foreground) dark:hover:text-indigo-400 transition px-3 py-1.5 rounded-lg bg-indigo-600"
        >
          Sign up
        </Link>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/user"
        className="px-3 py-1.5 rounded-lg border dark:border-gray-700"
      >
        {session?.user?.name?.split(" ")[0] ?? "Account"}
      </Link>
      <button
        type="button"
        className="px-3 py-1.5 rounded-lg border dark:border-gray-700"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Log out
      </button>
    </div>
  );
}
