export type EventStatus = "draft" | "ready" | "live" | "ended" | "archived";
export type ClientStatus =
  | "invited"
  | "portal_active"
  | "event_completed"
  | "archived";
export type EventType =
  | "wedding"
  | "birthday"
  | "corporate"
  | "milestone"
  | "social"
  | "community"
  | "other";
export type ReelStatus = "queued" | "processing" | "ready" | "failed";

export interface Client {
  id: string;
  name: string;
  organisation: string | null;
  email: string;
  phone: string | null;
  wedding_date: string | null;
  event_type_preference: EventType | null;
  notes: string | null;
  status: ClientStatus;
  portal_last_login_at: string | null;
  archived: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EventClient {
  id: string;
  name: string;
  email?: string;
}

export interface Event {
  id: string;
  name: string;
  client_id: string;
  event_type: EventType;
  start_time: string;
  end_time: string;
  venue_name: string | null;
  max_attendees: number;
  qr_token: string | null;
  qr_image_url: string | null;
  status: EventStatus;
  accent_color: string | null;
  cover_image_url: string | null;
  portal_gallery_visible: boolean;
  reel_shareable: boolean;
  retention_expires_at: string | null;
  client: EventClient;
}

export interface Media {
  id: string;
  event_id: string;
  file_url: string;
  file_type: "photo" | "video";
  filter_applied: string | null;
  challenge_tag: string | null;
  uploaded_at: string;
  is_hidden: boolean;
  is_starred: boolean;
  session?: {
    display_name: string | null;
  };
}

export interface Challenge {
  id: string;
  event_id: string;
  title: string;
  description: string;
  icon: string;
  is_required: boolean;
  sort_order: number;
}

export interface Reel {
  id: string;
  event_id: string;
  output_url: string | null;
  status: ReelStatus;
  music_track: string | null;
  description: string | null;
  published_at: string | null;
  created_at: string;
}

export interface ActivityLogEntry {
  id: string;
  type: string;
  label: string;
  entity_ref: string | null;
  created_at: string;
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    displayName?: string;
  };
  accessToken: string;
}

export interface CreateClientInput {
  name: string;
  email: string;
  organisation?: string;
  phone?: string;
  wedding_date?: string;
  event_type_preference?: EventType;
  notes?: string;
}

export interface UpdateClientInput extends Partial<CreateClientInput> {
  status?: ClientStatus;
  archived?: boolean;
  portal_last_login_at?: string;
}

export interface CreateEventInput {
  name: string;
  client_id: string;
  event_type: EventType;
  start_time: string;
  end_time: string;
  venue_name?: string;
  max_attendees: number;
  accent_color?: string;
  cover_image_url?: string;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  status?: EventStatus;
  max_attendees?: number;
  qr_token?: string | null;
  qr_image_url?: string | null;
  portal_gallery_visible?: boolean;
  reel_shareable?: boolean;
  retention_expires_at?: string | null;
}

export interface DashboardStats {
  activeEventsToday: number;
  uploadsThisWeek: number;
  clientsOnboarded: number;
  reelsDelivered: number;
}

export interface DashboardConfig extends DashboardStats {
  title: string;
  description: string;
}
