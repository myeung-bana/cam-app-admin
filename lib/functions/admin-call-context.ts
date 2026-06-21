import "server-only";
import { getAdminSession } from "@/lib/data/auth";

/** Best-effort operator id for Function audit headers (server-secret auth). */
export async function getActingAdminUserId(): Promise<string | undefined> {
  const session = await getAdminSession();
  return session?.user.id;
}
