import "server-only";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { generateJoinCode } from "@/lib/utils/join-code";
import type {
  Client,
  Event,
  DashboardConfig,
  CreateClientInput,
  UpdateClientInput,
  CreateEventInput,
  UpdateEventInput,
  Media,
  Challenge,
  Reel,
  ActivityLogEntry,
  EventStatus,
  AdminUser,
  CreateAdminUserInput,
  UpdateAdminUserInput,
  EventTypeTaxonomy,
  ChallengeTaxonomy,
  CreateEventTypeTaxonomyInput,
  UpdateEventTypeTaxonomyInput,
  CreateChallengeTaxonomyInput,
  UpdateChallengeTaxonomyInput,
} from "@/lib/types";
import {
  SEED_CLIENTS,
  SEED_EVENTS,
  SEED_DASHBOARD,
  SEED_CHALLENGES,
  SEED_MEDIA,
  SEED_REELS,
  SEED_ACTIVITY,
  SEED_ADMIN_USERS,
  SEED_EVENT_TYPE_TAXONOMY,
  SEED_CHALLENGE_TAXONOMY,
} from "./seed";

interface DevStoreData {
  dashboard: DashboardConfig;
  clients: Client[];
  events: Event[];
  challenges: Challenge[];
  media: Media[];
  reels: Reel[];
  activity: ActivityLogEntry[];
  adminUsers: AdminUser[];
  eventTypeTaxonomy: EventTypeTaxonomy[];
  challengeTaxonomy: ChallengeTaxonomy[];
}

const STORE_DIR = join(process.cwd(), ".data");
const STORE_PATH = join(STORE_DIR, "dev-store.json");

function defaultStore(): DevStoreData {
  return {
    dashboard: { ...SEED_DASHBOARD },
    clients: SEED_CLIENTS.map((c) => ({ ...c })),
    events: SEED_EVENTS.map((e) => ({ ...e })),
    challenges: SEED_CHALLENGES.map((c) => ({ ...c })),
    media: SEED_MEDIA.map((m) => ({ ...m })),
    reels: SEED_REELS.map((r) => ({ ...r })),
    activity: SEED_ACTIVITY.map((a) => ({ ...a })),
    adminUsers: SEED_ADMIN_USERS.map((u) => ({ ...u })),
    eventTypeTaxonomy: SEED_EVENT_TYPE_TAXONOMY.map((t) => ({ ...t })),
    challengeTaxonomy: SEED_CHALLENGE_TAXONOMY.map((t) => ({ ...t })),
  };
}

function readStore(): DevStoreData {
  if (!existsSync(STORE_PATH)) return defaultStore();
  try {
    const raw = readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<DevStoreData>;
    const defaults = defaultStore();
    return {
      dashboard: { ...defaults.dashboard, ...parsed.dashboard },
      clients: parsed.clients ?? defaults.clients,
      events: parsed.events ?? defaults.events,
      challenges: parsed.challenges ?? defaults.challenges,
      media: parsed.media ?? defaults.media,
      reels: parsed.reels ?? defaults.reels,
      activity: parsed.activity ?? defaults.activity,
      adminUsers: parsed.adminUsers ?? defaults.adminUsers,
      eventTypeTaxonomy: parsed.eventTypeTaxonomy ?? defaults.eventTypeTaxonomy,
      challengeTaxonomy: parsed.challengeTaxonomy ?? defaults.challengeTaxonomy,
    };
  } catch {
    return defaultStore();
  }
}

function writeStore(data: DevStoreData): void {
  if (!existsSync(STORE_DIR)) mkdirSync(STORE_DIR, { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function logActivity(
  type: string,
  label: string,
  entityRef?: string
): void {
  const store = readStore();
  store.activity.unshift({
    id: randomUUID(),
    type,
    label,
    entity_ref: entityRef ?? null,
    created_at: new Date().toISOString(),
  });
  store.activity = store.activity.slice(0, 50);
  writeStore(store);
}

// Dashboard
export function getDevDashboard(): DashboardConfig {
  return readStore().dashboard;
}

export function updateDevDashboard(
  updates: Partial<DashboardConfig>
): DashboardConfig {
  const store = readStore();
  store.dashboard = { ...store.dashboard, ...updates };
  writeStore(store);
  return store.dashboard;
}

// Clients
export function getDevClients(): Client[] {
  return readStore().clients.filter((c) => !c.archived);
}

export function getDevClientById(id: string): Client | null {
  return readStore().clients.find((c) => c.id === id) ?? null;
}

export function createDevClient(input: CreateClientInput): Client {
  const store = readStore();
  const client: Client = {
    id: randomUUID(),
    name: input.name,
    organisation: input.organisation ?? null,
    email: input.email,
    phone: input.phone ?? null,
    wedding_date: input.wedding_date ?? null,
    event_type_preference: input.event_type_preference ?? null,
    notes: input.notes ?? null,
    status: "invited",
    portal_last_login_at: null,
    archived: false,
    created_at: new Date().toISOString(),
  };
  store.clients.push(client);
  writeStore(store);
  logActivity("client_created", `Client ${client.name} created`, client.id);
  return client;
}

export function updateDevClient(id: string, input: UpdateClientInput): Client {
  const store = readStore();
  const index = store.clients.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Client not found");
  store.clients[index] = {
    ...store.clients[index],
    ...input,
    updated_at: new Date().toISOString(),
  };
  writeStore(store);
  return store.clients[index];
}

export function archiveDevClient(id: string): Client {
  return updateDevClient(id, { archived: true, status: "archived" });
}

// Events
export function getDevEvents(): Event[] {
  return readStore().events;
}

export function getDevEventsByClientId(clientId: string): Event[] {
  return readStore().events.filter((e) => e.client_id === clientId);
}

export function getDevEventById(id: string): Event | null {
  return readStore().events.find((e) => e.id === id) ?? null;
}

export function getDevUpcomingEvents(days = 7): Event[] {
  const now = new Date();
  const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return readStore()
    .events.filter((e) => {
      const start = new Date(e.start_time);
      return start >= now && start <= cutoff && e.status !== "archived";
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
}

export function createDevEvent(input: CreateEventInput): Event {
  const store = readStore();
  const client = store.clients.find((c) => c.id === input.client_id);
  if (!client) throw new Error("Client not found");

  const event: Event = {
    id: randomUUID(),
    name: input.name,
    client_id: input.client_id,
    event_type: input.event_type,
    start_time: input.start_time,
    end_time: input.end_time,
    venue_name: input.venue_name ?? null,
    max_attendees: input.max_attendees,
    join_code: generateJoinCode(),
    qr_access_enabled: true,
    status: "draft",
    accent_color: input.accent_color ?? null,
    cover_image_url: input.cover_image_url ?? null,
    portal_gallery_visible: false,
    reel_shareable: false,
    retention_expires_at: null,
    client: { id: client.id, name: client.name, email: client.email },
  };
  store.events.unshift(event);
  writeStore(store);
  logActivity("event_created", `Event ${event.name} created`, event.id);
  return event;
}

export function updateDevEvent(id: string, input: UpdateEventInput): Event {
  const store = readStore();
  const index = store.events.findIndex((e) => e.id === id);
  if (index === -1) throw new Error("Event not found");

  const existing = store.events[index];
  const client = input.client_id
    ? store.clients.find((c) => c.id === input.client_id)
    : store.clients.find((c) => c.id === existing.client_id);

  store.events[index] = {
    ...existing,
    ...input,
    client: client
      ? { id: client.id, name: client.name, email: client.email }
      : existing.client,
  };
  writeStore(store);
  return store.events[index];
}

export function rotateDevJoinCode(id: string): Event {
  const store = readStore();
  const index = store.events.findIndex((e) => e.id === id);
  if (index === -1) throw new Error("Event not found");

  const existing = store.events[index];
  store.events[index] = {
    ...existing,
    join_code: generateJoinCode(),
    join_code_rotated_at: new Date().toISOString(),
  };
  writeStore(store);
  logActivity("join_code_rotated", "Event join code rotated (emergency)", id);
  return store.events[index];
}

export function transitionDevEventStatus(
  id: string,
  status: EventStatus
): Event {
  const store = readStore();
  const event = store.events.find((e) => e.id === id);
  if (!event) throw new Error("Event not found");
  const labels: Record<EventStatus, string> = {
    draft: "moved to Draft",
    ready: "marked Ready",
    live: "is now Live",
    ended: "has Ended",
    archived: "was Archived",
  };
  logActivity("event_status", `${event.name} ${labels[status]}`, id);
  return updateDevEvent(id, { status });
}

// Challenges
export function getDevChallenges(eventId: string): Challenge[] {
  return readStore()
    .challenges.filter((c) => c.event_id === eventId)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function saveDevChallenges(
  eventId: string,
  challenges: Omit<Challenge, "event_id">[]
): Challenge[] {
  const store = readStore();
  store.challenges = store.challenges.filter((c) => c.event_id !== eventId);
  const saved = challenges.map((c, i) => ({
    ...c,
    event_id: eventId,
    sort_order: i,
  }));
  store.challenges.push(...saved);
  writeStore(store);
  return saved;
}

export function loadChallengeTemplate(
  eventId: string,
  eventType: string
): Challenge[] {
  const store = readStore();
  const template = store.challengeTaxonomy
    .filter(
      (t) =>
        t.active &&
        (t.event_type_slug === eventType || t.event_type_slug === null)
    )
    .sort((a, b) => a.sort_order - b.sort_order);

  const fallback =
    template.length > 0
      ? template
      : store.challengeTaxonomy
          .filter((t) => t.active && t.event_type_slug === "wedding")
          .sort((a, b) => a.sort_order - b.sort_order);

  return saveDevChallenges(
    eventId,
    fallback.map((t, i) => ({
      id: randomUUID(),
      title: t.label,
      description: t.description ?? "",
      icon: t.icon,
      is_required: t.is_required,
      sort_order: i,
    }))
  );
}

// Media
export function getDevMedia(eventId: string): Media[] {
  return readStore()
    .media.filter((m) => m.event_id === eventId)
    .sort(
      (a, b) =>
        new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
    );
}

export function updateDevMedia(
  id: string,
  updates: Partial<Pick<Media, "is_hidden" | "is_starred">>
): Media {
  const store = readStore();
  const index = store.media.findIndex((m) => m.id === id);
  if (index === -1) throw new Error("Media not found");
  store.media[index] = { ...store.media[index], ...updates };
  writeStore(store);
  return store.media[index];
}

// Reels
export function getDevReel(eventId: string): Reel | null {
  return readStore().reels.find((r) => r.event_id === eventId) ?? null;
}

export function createDevReel(eventId: string, musicTrack: string): Reel {
  const store = readStore();
  const existing = store.reels.findIndex((r) => r.event_id === eventId);
  const reel: Reel = {
    id: randomUUID(),
    event_id: eventId,
    output_url: null,
    status: "queued",
    music_track: musicTrack,
    description: null,
    published_at: null,
    created_at: new Date().toISOString(),
  };
  if (existing >= 0) store.reels[existing] = reel;
  else store.reels.push(reel);
  writeStore(store);
  logActivity("reel_queued", "Reel generation queued", eventId);
  return reel;
}

export function publishDevReel(eventId: string): Reel {
  const store = readStore();
  const reel = store.reels.find((r) => r.event_id === eventId);
  if (!reel) throw new Error("Reel not found");
  reel.status = "ready";
  reel.output_url = "/placeholder-reel.mp4";
  reel.published_at = new Date().toISOString();
  const event = store.events.find((e) => e.id === eventId);
  if (event) {
    event.portal_gallery_visible = true;
    transitionDevEventStatus(eventId, "archived");
  }
  writeStore(store);
  logActivity("reel_published", `Reel published for ${event?.name ?? eventId}`, eventId);
  return reel;
}

// Activity
export function getDevActivity(limit = 10): ActivityLogEntry[] {
  return readStore().activity.slice(0, limit);
}

// Admin users
export function getDevAdminUsers(): AdminUser[] {
  return readStore().adminUsers;
}

export function getDevAdminUserById(id: string): AdminUser | null {
  return readStore().adminUsers.find((u) => u.id === id) ?? null;
}

export function createDevAdminUser(input: CreateAdminUserInput): AdminUser {
  const store = readStore();
  const user: AdminUser = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    role: input.role ?? "admin",
    status: "active",
    phone: input.phone ?? null,
    notes: input.notes ?? null,
    last_login_at: null,
    created_at: new Date().toISOString(),
  };
  store.adminUsers.push(user);
  writeStore(store);
  logActivity("admin_user_created", `Admin user ${user.name} invited`, user.id);
  return user;
}

export function updateDevAdminUser(
  id: string,
  input: UpdateAdminUserInput
): AdminUser {
  const store = readStore();
  const index = store.adminUsers.findIndex((u) => u.id === id);
  if (index === -1) throw new Error("Admin user not found");
  store.adminUsers[index] = {
    ...store.adminUsers[index],
    ...input,
    updated_at: new Date().toISOString(),
  };
  writeStore(store);
  return store.adminUsers[index];
}

// Taxonomy — event types
export function getDevEventTypeTaxonomy(): EventTypeTaxonomy[] {
  return readStore()
    .eventTypeTaxonomy.filter((t) => t.active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getDevAllEventTypeTaxonomy(): EventTypeTaxonomy[] {
  return readStore()
    .eventTypeTaxonomy.sort((a, b) => a.sort_order - b.sort_order);
}

export function getDevEventTypeTaxonomyById(
  id: string
): EventTypeTaxonomy | null {
  return readStore().eventTypeTaxonomy.find((t) => t.id === id) ?? null;
}

export function createDevEventTypeTaxonomy(
  input: CreateEventTypeTaxonomyInput
): EventTypeTaxonomy {
  const store = readStore();
  const item: EventTypeTaxonomy = {
    id: randomUUID(),
    kind: "event-types",
    slug: input.slug,
    label: input.label,
    description: input.description ?? null,
    sort_order: input.sort_order ?? store.eventTypeTaxonomy.length,
    active: input.active ?? true,
    created_at: new Date().toISOString(),
  };
  store.eventTypeTaxonomy.push(item);
  writeStore(store);
  logActivity("taxonomy_created", `Event type ${item.label} created`, item.id);
  return item;
}

export function updateDevEventTypeTaxonomy(
  id: string,
  input: UpdateEventTypeTaxonomyInput
): EventTypeTaxonomy {
  const store = readStore();
  const index = store.eventTypeTaxonomy.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Event type not found");
  store.eventTypeTaxonomy[index] = {
    ...store.eventTypeTaxonomy[index],
    ...input,
    updated_at: new Date().toISOString(),
  };
  writeStore(store);
  return store.eventTypeTaxonomy[index];
}

// Taxonomy — challenges
export function getDevChallengeTaxonomy(): ChallengeTaxonomy[] {
  return readStore()
    .challengeTaxonomy.sort((a, b) => a.sort_order - b.sort_order);
}

export function getDevChallengeTaxonomyById(
  id: string
): ChallengeTaxonomy | null {
  return readStore().challengeTaxonomy.find((t) => t.id === id) ?? null;
}

export function createDevChallengeTaxonomy(
  input: CreateChallengeTaxonomyInput
): ChallengeTaxonomy {
  const store = readStore();
  const item: ChallengeTaxonomy = {
    id: randomUUID(),
    kind: "challenges",
    slug: input.slug,
    label: input.label,
    description: input.description ?? null,
    icon: input.icon ?? "📸",
    is_required: input.is_required ?? false,
    event_type_slug: input.event_type_slug ?? null,
    sort_order: input.sort_order ?? store.challengeTaxonomy.length,
    active: input.active ?? true,
    created_at: new Date().toISOString(),
  };
  store.challengeTaxonomy.push(item);
  writeStore(store);
  logActivity("taxonomy_created", `Challenge ${item.label} created`, item.id);
  return item;
}

export function updateDevChallengeTaxonomy(
  id: string,
  input: UpdateChallengeTaxonomyInput
): ChallengeTaxonomy {
  const store = readStore();
  const index = store.challengeTaxonomy.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Challenge taxonomy not found");
  store.challengeTaxonomy[index] = {
    ...store.challengeTaxonomy[index],
    ...input,
    updated_at: new Date().toISOString(),
  };
  writeStore(store);
  return store.challengeTaxonomy[index];
}
