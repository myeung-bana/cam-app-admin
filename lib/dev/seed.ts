import type { Client, Event, DashboardConfig } from "@/lib/types";

export const SEED_DASHBOARD: DashboardConfig = {
  title: "Dashboard",
  description: "Overview of your wedding capture events.",
  activeEventsToday: 2,
  totalUploadsToday: 147,
  liveSessionsOnline: 38,
};

export const SEED_CLIENTS: Client[] = [
  {
    id: "11111111-1111-1111-1111-111111111101",
    name: "Sarah & James",
    email: "sarah.james@example.com",
    phone: "+44 7700 900123",
    wedding_date: "2026-09-14",
    notes: "Outdoor ceremony at Kew Gardens",
    archived: false,
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111102",
    name: "Emma & Oliver",
    email: "emma.oliver@example.com",
    phone: "+44 7700 900456",
    wedding_date: "2026-11-22",
    notes: null,
    archived: false,
    created_at: "2026-02-05T14:30:00Z",
  },
];

export const SEED_EVENTS: Event[] = [
  {
    id: "22222222-2222-2222-2222-222222222201",
    name: "Sarah & James Wedding",
    client_id: "11111111-1111-1111-1111-111111111101",
    start_time: "2026-09-14T12:00:00Z",
    end_time: "2026-09-14T23:00:00Z",
    venue_name: "Kew Gardens",
    max_attendees: 150,
    qr_token: null,
    qr_image_url: null,
    status: "draft",
    cover_image_url: null,
    client: { id: "11111111-1111-1111-1111-111111111101", name: "Sarah & James" },
  },
  {
    id: "22222222-2222-2222-2222-222222222202",
    name: "Emma & Oliver Reception",
    client_id: "11111111-1111-1111-1111-111111111102",
    start_time: "2026-11-22T16:00:00Z",
    end_time: "2026-11-22T23:30:00Z",
    venue_name: "The Orangery",
    max_attendees: 80,
    qr_token: null,
    qr_image_url: null,
    status: "active",
    cover_image_url: null,
    client: { id: "11111111-1111-1111-1111-111111111102", name: "Emma & Oliver" },
  },
];
