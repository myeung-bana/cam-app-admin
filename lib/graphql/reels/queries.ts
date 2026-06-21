import { gql } from "graphql-tag";

export const GET_EVENT_REEL = gql`
  query GetEventReel($eventId: uuid!) {
    reels(
      where: { event_id: { _eq: $eventId } }
      order_by: { created_at: desc }
      limit: 1
    ) {
      id
      event_id
      output_url
      status
      music_track
      description
      published_at
      created_at
    }
  }
`;
