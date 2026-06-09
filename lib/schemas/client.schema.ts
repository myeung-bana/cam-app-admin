import { z } from "zod";

const eventTypes = [
  "wedding",
  "birthday",
  "corporate",
  "milestone",
  "social",
  "community",
  "other",
] as const;

export const clientSchema = z.object({
  name: z.string().min(2, "Client name is required"),
  email: z.string().email("A valid email is required"),
  organisation: z.string().optional(),
  phone: z.string().optional(),
  wedding_date: z.string().optional(),
  event_type_preference: z.enum(eventTypes).optional(),
  notes: z.string().optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;
