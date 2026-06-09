"use server";

import { revalidatePath } from "next/cache";
import { isDevMode } from "@/lib/dev/config";
import { saveDashboardConfig } from "@/lib/data/dashboard";
import { z } from "zod";

const dashboardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  activeEventsToday: z.coerce.number().int().min(0),
  totalUploadsToday: z.coerce.number().int().min(0),
  liveSessionsOnline: z.coerce.number().int().min(0),
});

export type DashboardFormState = {
  error?: string;
  success?: boolean;
};

export async function updateDashboardAction(
  _prev: DashboardFormState,
  formData: FormData
): Promise<DashboardFormState> {
  if (!isDevMode()) {
    return { error: "Dashboard editing is only available in dev mode." };
  }

  const raw = Object.fromEntries(formData);
  const parsed = dashboardSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await saveDashboardConfig(parsed.data);
  revalidatePath("/admin/dashboard");

  return { success: true };
}
