import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  fetchOptions: {
    // Ensures cookies are sent and received correctly across the application
    credentials: "include",
    onError(e) {
      console.error("Auth client error:", e);
    },
  },
});

export const { signIn, signUp, signOut, useSession, useUser } = authClient;
