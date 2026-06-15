import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "Client name is required"),
  email: z.string().email("A valid email is required"),
  organisation: z.string().optional(),
  phone: z.string().optional(),
  wedding_date: z.string().optional(),
  event_type_preference: z.string().optional(),
  notes: z.string().optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;
