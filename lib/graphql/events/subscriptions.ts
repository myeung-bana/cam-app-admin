import { gql } from "graphql-tag";

export const SUBSCRIBE_ACTIVE_SESSIONS = gql`
  subscription ActiveSessionCount($eventId: uuid!) {
    guest_sessions_aggregate(
      where: {
        event_id: { _eq: $eventId }
        last_heartbeat_at: { _gt: "now() - interval '5 minutes'" }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const SUBSCRIBE_MEDIA_FEED = gql`
  subscription MediaFeed($eventId: uuid!) {
    media(
      where: { event_id: { _eq: $eventId } }
      order_by: { uploaded_at: desc }
      limit: 50
    ) {
      id
      file_url
      storage_file_id
      file_type
      filter_applied
      uploaded_at
      is_hidden
      is_starred
      session {
        display_name
      }
    }
  }
`;
