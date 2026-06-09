import { gql } from "graphql-tag";

export const GET_EVENT_MEDIA = gql`
  query GetEventMedia($eventId: uuid!) {
    media(
      where: { event_id: { _eq: $eventId } }
      order_by: { uploaded_at: desc }
    ) {
      id
      event_id
      file_url
      file_type
      filter_applied
      uploaded_at
      session {
        display_name
      }
    }
  }
`;
