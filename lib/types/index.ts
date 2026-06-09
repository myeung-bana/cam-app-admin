export type EventStatus = "draft" | "active" | "ended" | "archived";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  wedding_date: string | null;
  notes: string | null;
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
  start_time: string;
  end_time: string;
  venue_name: string | null;
  max_attendees: number;
  qr_token: string | null;
  qr_image_url: string | null;
  status: EventStatus;
  cover_image_url: string | null;
  client: EventClient;
}

export interface Media {
  id: string;
  event_id: string;
  file_url: string;
  file_type: "photo" | "video";
  filter_applied: string | null;
  uploaded_at: string;
  session?: {
    display_name: string | null;
  };
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
  phone?: string;
  wedding_date?: string;
  notes?: string;
}

export interface UpdateClientInput extends Partial<CreateClientInput> {
  archived?: boolean;
}

export interface CreateEventInput {
  name: string;
  client_id: string;
  start_time: string;
  end_time: string;
  venue_name?: string;
  max_attendees: number;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  status?: EventStatus;
}

export interface DashboardStats {
  activeEventsToday: number;
  totalUploadsToday: number;
  liveSessionsOnline: number;
}

export interface DashboardConfig extends DashboardStats {
  title: string;
  description: string;
}
