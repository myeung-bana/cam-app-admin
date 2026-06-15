import { z } from "zod";

export const adminUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("A valid email is required"),
  role: z.enum(["owner", "admin"]),
  status: z.enum(["active", "inactive"]),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const createAdminUserSchema = adminUserSchema.omit({ status: true });

export type AdminUserInput = z.infer<typeof adminUserSchema>;
export type CreateAdminUserFormInput = z.infer<typeof createAdminUserSchema>;
