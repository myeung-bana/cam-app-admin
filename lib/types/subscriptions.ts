export interface ActiveSessionsData {
  guest_sessions_aggregate?: {
    aggregate?: {
      count?: number;
    };
  };
}

export interface MediaFeedData {
  media?: Array<{
    id: string;
    file_url: string;
    storage_file_id?: string | null;
    file_type: string;
    filter_applied: string | null;
    uploaded_at: string;
    is_hidden: boolean;
    is_starred: boolean;
    session?: {
      display_name: string | null;
    };
  }>;
}
