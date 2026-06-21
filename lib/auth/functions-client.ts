import "server-only";
import { callFunction } from "@/lib/functions/client";

export interface FunctionAuthSession {
  user: {
    id: string;
    email: string;
    displayName?: string;
    defaultRole?: string;
  };
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
}

export async function signInViaFunction(
  email: string,
  password: string
): Promise<FunctionAuthSession> {
  return callFunction<FunctionAuthSession>("/admin/auth/sign-in", {
    method: "POST",
    body: { email, password },
  });
}

export async function refreshViaFunction(
  refreshToken: string
): Promise<FunctionAuthSession> {
  return callFunction<FunctionAuthSession>("/admin/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });
}

export async function signOutViaFunction(refreshToken: string): Promise<void> {
  await callFunction<{ signedOut: boolean }>("/admin/auth/sign-out", {
    method: "POST",
    body: { refreshToken },
  });
}
