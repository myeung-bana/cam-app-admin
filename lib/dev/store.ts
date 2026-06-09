import "server-only";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import type {
  Client,
  Event,
  DashboardConfig,
  CreateClientInput,
  UpdateClientInput,
  CreateEventInput,
  UpdateEventInput,
} from "@/lib/types";
import { SEED_CLIENTS, SEED_EVENTS, SEED_DASHBOARD } from "./seed";

interface DevStoreData {
  dashboard: DashboardConfig;
  clients: Client[];
  events: Event[];
}

const STORE_DIR = join(process.cwd(), ".data");
const STORE_PATH = join(STORE_DIR, "dev-store.json");

function readStore(): DevStoreData {
  if (!existsSync(STORE_PATH)) {
    return {
      dashboard: { ...SEED_DASHBOARD },
      clients: SEED_CLIENTS.map((c) => ({ ...c })),
      events: SEED_EVENTS.map((e) => ({ ...e })),
    };
  }

  try {
    const raw = readFileSync(STORE_PATH, "utf-8");
    return JSON.parse(raw) as DevStoreData;
  } catch {
    return {
      dashboard: { ...SEED_DASHBOARD },
      clients: SEED_CLIENTS.map((c) => ({ ...c })),
      events: SEED_EVENTS.map((e) => ({ ...e })),
    };
  }
}

function writeStore(data: DevStoreData): void {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
  }
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

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
    email: input.email,
    phone: input.phone ?? null,
    wedding_date: input.wedding_date ?? null,
    notes: input.notes ?? null,
    archived: false,
    created_at: new Date().toISOString(),
  };
  store.clients.push(client);
  writeStore(store);
  return client;
}

export function updateDevClient(
  id: string,
  input: UpdateClientInput
): Client {
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

export function getDevEvents(): Event[] {
  return readStore().events;
}

export function getDevEventById(id: string): Event | null {
  return readStore().events.find((e) => e.id === id) ?? null;
}

export function createDevEvent(input: CreateEventInput): Event {
  const store = readStore();
  const client = store.clients.find((c) => c.id === input.client_id);
  if (!client) throw new Error("Client not found");

  const event: Event = {
    id: randomUUID(),
    name: input.name,
    client_id: input.client_id,
    start_time: input.start_time,
    end_time: input.end_time,
    venue_name: input.venue_name ?? null,
    max_attendees: input.max_attendees,
    qr_token: null,
    qr_image_url: null,
    status: "draft",
    cover_image_url: null,
    client: { id: client.id, name: client.name, email: client.email },
  };
  store.events.unshift(event);
  writeStore(store);
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
