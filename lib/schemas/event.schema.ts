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

export const eventSchema = z
  .object({
    name: z.string().min(2, "Event name is required"),
    client_id: z.string().uuid("A client must be selected"),
    event_type: z.enum(eventTypes),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
    venue_name: z.string().optional(),
    max_attendees: z.coerce.number().int().min(1).max(10_000),
    accent_color: z.string().optional(),
    cover_image_url: z.string().optional(),
  })
  .refine((d) => new Date(d.end_time) > new Date(d.start_time), {
    message: "End time must be after start time",
    path: ["end_time"],
  });

export type EventInput = z.infer<typeof eventSchema>;
