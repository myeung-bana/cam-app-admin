import type {
  Client,
  Event,
  DashboardConfig,
  Media,
  Challenge,
  Reel,
  ActivityLogEntry,
} from "@/lib/types";

export const SEED_DASHBOARD: DashboardConfig = {
  title: "Dashboard",
  description: "Operational overview across all Memo clients and events.",
  activeEventsToday: 2,
  uploadsThisWeek: 847,
  clientsOnboarded: 12,
  reelsDelivered: 8,
};

export const SEED_CLIENTS: Client[] = [
  {
    id: "11111111-1111-1111-1111-111111111101",
    name: "Sarah & James",
    organisation: null,
    email: "sarah.james@example.com",
    phone: "+44 7700 900123",
    wedding_date: "2026-09-14",
    event_type_preference: "wedding",
    notes: "Outdoor ceremony at Kew Gardens",
    status: "portal_active",
    portal_last_login_at: "2026-06-01T09:30:00Z",
    archived: false,
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111102",
    name: "Acme Corp",
    organisation: "Acme Corp",
    email: "events@acme.example.com",
    phone: "+44 7700 900456",
    wedding_date: null,
    event_type_preference: "corporate",
    notes: "Annual team retreat — Q4",
    status: "invited",
    portal_last_login_at: null,
    archived: false,
    created_at: "2026-02-05T14:30:00Z",
  },
];

export const SEED_EVENTS: Event[] = [
  {
    id: "22222222-2222-2222-2222-222222222201",
    name: "Sarah & James Wedding",
    client_id: "11111111-1111-1111-1111-111111111101",
    event_type: "wedding",
    start_time: "2026-09-14T12:00:00Z",
    end_time: "2026-09-14T23:00:00Z",
    venue_name: "Kew Gardens",
    max_attendees: 150,
    qr_token: null,
    qr_image_url: null,
    status: "ready",
    accent_color: "#c9a87c",
    cover_image_url: null,
    portal_gallery_visible: false,
    reel_shareable: false,
    retention_expires_at: "2027-09-14T23:00:00Z",
    client: { id: "11111111-1111-1111-1111-111111111101", name: "Sarah & James" },
  },
  {
    id: "22222222-2222-2222-2222-222222222202",
    name: "Acme Team Retreat 2026",
    client_id: "11111111-1111-1111-1111-111111111102",
    event_type: "corporate",
    start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    venue_name: "Lake District Lodge",
    max_attendees: 80,
    qr_token: null,
    qr_image_url: null,
    status: "live",
    accent_color: "#2563eb",
    cover_image_url: null,
    portal_gallery_visible: true,
    reel_shareable: false,
    retention_expires_at: "2027-06-01T23:00:00Z",
    client: { id: "11111111-1111-1111-1111-111111111102", name: "Acme Corp" },
  },
];

export const SEED_CHALLENGES: Challenge[] = [
  {
    id: "33333333-3333-3333-3333-333333333301",
    event_id: "22222222-2222-2222-2222-222222222201",
    title: "Capture a candid laugh",
    description: "Get a natural, unposed moment of joy",
    icon: "📸",
    is_required: false,
    sort_order: 0,
  },
  {
    id: "33333333-3333-3333-3333-333333333302",
    event_id: "22222222-2222-2222-2222-222222222201",
    title: "Dance floor moment",
    description: "Photo from the dance floor",
    icon: "💃",
    is_required: false,
    sort_order: 1,
  },
  {
    id: "33333333-3333-3333-3333-333333333303",
    event_id: "22222222-2222-2222-2222-222222222202",
    title: "Team photo",
    description: "Group shot with your team",
    icon: "👥",
    is_required: true,
    sort_order: 0,
  },
];

export const SEED_MEDIA: Media[] = [
  {
    id: "44444444-4444-4444-4444-444444444401",
    event_id: "22222222-2222-2222-2222-222222222202",
    file_url: "/placeholder.jpg",
    file_type: "photo",
    filter_applied: "warm",
    challenge_tag: "33333333-3333-3333-3333-333333333303",
    uploaded_at: new Date().toISOString(),
    is_hidden: false,
    is_starred: true,
    session: { display_name: "Alex" },
  },
  {
    id: "44444444-4444-4444-4444-444444444402",
    event_id: "22222222-2222-2222-2222-222222222202",
    file_url: "/placeholder.jpg",
    file_type: "photo",
    filter_applied: "original",
    challenge_tag: null,
    uploaded_at: new Date(Date.now() - 3600000).toISOString(),
    is_hidden: false,
    is_starred: false,
    session: { display_name: "Jordan" },
  },
];

export const SEED_REELS: Reel[] = [];

export const SEED_ACTIVITY: ActivityLogEntry[] = [
  {
    id: "act-001",
    type: "client_created",
    label: "Client Acme Corp created",
    entity_ref: "11111111-1111-1111-1111-111111111102",
    created_at: "2026-02-05T14:30:00Z",
  },
  {
    id: "act-002",
    type: "event_ready",
    label: "Sarah & James Wedding marked Ready",
    entity_ref: "22222222-2222-2222-2222-222222222201",
    created_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "act-003",
    type: "event_live",
    label: "Acme Team Retreat 2026 is now Live",
    entity_ref: "22222222-2222-2222-2222-222222222202",
    created_at: new Date().toISOString(),
  },
];

export const CHALLENGE_TEMPLATES: Record<
  string,
  Omit<Challenge, "id" | "event_id" | "sort_order">[]
> = {
  wedding: [
    { title: "Capture a candid laugh", description: "A natural moment of joy", icon: "📸", is_required: false },
    { title: "Dance floor moment", description: "Photo from the dance floor", icon: "💃", is_required: false },
    { title: "Toast moment", description: "Clink those glasses", icon: "🥂", is_required: false },
    { title: "Photo with the couple", description: "A shot with the happy couple", icon: "👰", is_required: true },
    { title: "Best venue shot", description: "Capture the venue at its best", icon: "🌅", is_required: false },
  ],
  corporate: [
    { title: "Team photo", description: "Group shot with your team", icon: "👥", is_required: true },
    { title: "Presentation moment", description: "Someone on stage or presenting", icon: "🎤", is_required: false },
    { title: "Networking", description: "People connecting over coffee", icon: "☕", is_required: false },
  ],
  birthday: [
    { title: "Cake moment", description: "Blowing out candles or cutting cake", icon: "🎂", is_required: true },
    { title: "Group selfie", description: "Selfie with friends", icon: "🤳", is_required: false },
  ],
};
