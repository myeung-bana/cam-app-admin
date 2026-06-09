export interface ActiveSessionsData {
  sessions_aggregate?: {
    aggregate?: {
      count?: number;
    };
  };
}

export interface MediaFeedData {
  media?: Array<{
    id: string;
    file_url: string;
    file_type: string;
    filter_applied: string | null;
    uploaded_at: string;
    session?: {
      display_name: string | null;
    };
  }>;
}
