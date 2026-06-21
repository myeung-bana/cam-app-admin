import { gql } from "graphql-tag";

export const SUBSCRIBE_EVENT_MEDIA = gql`
  subscription EventMedia($eventId: uuid!) {
    media(
      where: { event_id: { _eq: $eventId } }
      order_by: { uploaded_at: desc }
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
