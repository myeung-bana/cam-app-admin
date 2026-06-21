import "server-only";
import { redirect } from "next/navigation";
import {
  FLASH_QUERY_PARAM,
  type SuccessMessageKey,
} from "@/lib/ui/success-toast";

export function redirectWithSuccessFlash(
  path: string,
  key: SuccessMessageKey
): never {
  const separator = path.includes("?") ? "&" : "?";
  redirect(`${path}${separator}${FLASH_QUERY_PARAM}=${key}`);
}
