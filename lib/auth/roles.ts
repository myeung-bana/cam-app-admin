import { jwtDecode } from "jwt-decode";
import { ADMIN_ROLE } from "./constants";

interface HasuraJwtClaims {
  "https://hasura.io/jwt/claims"?: {
    "x-hasura-default-role"?: string;
    "x-hasura-allowed-roles"?: string[] | string;
  };
}

function normalizeAllowedRoles(
  allowed: string[] | string | undefined
): string[] {
  if (!allowed) return [];
  if (Array.isArray(allowed)) return allowed;
  if (allowed.startsWith("{") && allowed.endsWith("}")) {
    return allowed
      .slice(1, -1)
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);
  }
  return [allowed];
}

export function isAdminUser(input: {
  defaultRole?: string | null;
  roles?: string[] | null;
  accessToken?: string | null;
}): boolean {
  if (input.defaultRole === ADMIN_ROLE) return true;
  if (input.roles?.includes(ADMIN_ROLE)) return true;

  if (!input.accessToken) return false;

  try {
    const decoded = jwtDecode<HasuraJwtClaims>(input.accessToken);
    const claims = decoded["https://hasura.io/jwt/claims"];
    const defaultRole = claims?.["x-hasura-default-role"];
    const allowedRoles = normalizeAllowedRoles(
      claims?.["x-hasura-allowed-roles"]
    );

    return defaultRole === ADMIN_ROLE || allowedRoles.includes(ADMIN_ROLE);
  } catch {
    return false;
  }
}
