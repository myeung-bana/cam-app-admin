export type EventStatus = "draft" | "ready" | "live" | "ended" | "archived";
export type ClientStatus =
  | "invited"
  | "portal_active"
  | "event_completed"
  | "archived";
export type EventType = string;
export type TaxonomyKind = "event-types" | "challenges";

export interface TaxonomyItemBase {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface EventTypeTaxonomy extends TaxonomyItemBase {
  kind: "event-types";
}

export interface ChallengeTaxonomy extends TaxonomyItemBase {
  kind: "challenges";
  icon: string;
  is_required: boolean;
  event_type_slug: string | null;
}

export type TaxonomyItem = EventTypeTaxonomy | ChallengeTaxonomy;

export interface CreateEventTypeTaxonomyInput {
  slug: string;
  label: string;
  description?: string;
  sort_order?: number;
  active?: boolean;
}

export type UpdateEventTypeTaxonomyInput = Partial<CreateEventTypeTaxonomyInput>;

export interface CreateChallengeTaxonomyInput {
  slug: string;
  label: string;
  description?: string;
  icon?: string;
  is_required?: boolean;
  event_type_slug?: string | null;
  sort_order?: number;
  active?: boolean;
}

export type UpdateChallengeTaxonomyInput = Partial<CreateChallengeTaxonomyInput>;
export type ReelStatus = "queued" | "processing" | "ready" | "failed";
export type AdminUserStatus = "active" | "inactive";
export type AdminUserRole = "owner" | "admin";

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
  join_code: string;
  qr_access_enabled: boolean;
  join_code_rotated_at?: string | null;
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
  storage_file_id?: string | null;
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

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  phone: string | null;
  notes: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CreateAdminUserInput {
  name: string;
  email: string;
  role?: AdminUserRole;
  phone?: string;
  notes?: string;
}

export interface UpdateAdminUserInput extends Partial<CreateAdminUserInput> {
  status?: AdminUserStatus;
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    displayName?: string;
  };
  accessToken: string;
  role?: string;
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
  qr_access_enabled?: boolean;
  join_code?: string;
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
