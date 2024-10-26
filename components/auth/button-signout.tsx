"use client";
import { signOut } from "next-auth/react";

export default function ButtonSignOut() {
  return (
    <button onClick={() => signOut({ redirect: true, callbackUrl: "/" })}>
      Logout
    </button>
  );
}
