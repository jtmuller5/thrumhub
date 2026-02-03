"use client";

import { useSession, signOut } from "next-auth/react";

export function NavAuth() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors"
      >
        Sign Out
      </button>
    );
  }

  return (
    <a
      href="/login"
      className="bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-md hover:bg-teal-500/20 transition-colors"
    >
      Sign In
    </a>
  );
}
