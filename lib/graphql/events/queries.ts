import { gql } from "graphql-tag";

export const GET_EVENTS = gql`
  query GetEvents {
    events(order_by: { start_time: desc }) {
      id
      name
      status
      start_time
      end_time
      max_attendees
      join_code
      event_type
      client_id
      client {
        id
        name
        email
      }
    }
  }
`;

export const GET_EVENT_BY_ID = gql`
  query GetEventById($id: uuid!) {
    events_by_pk(id: $id) {
      id
      name
      status
      start_time
      end_time
      venue_name
      max_attendees
      join_code
      qr_access_enabled
      join_code_rotated_at
      event_type
      accent_color
      cover_image_url
      portal_gallery_visible
      reel_shareable
      retention_expires_at
      client_id
      client {
        id
        name
        email
      }
    }
  }
`;

export const GET_EVENT_BY_JOIN_CODE = gql`
  query GetEventByJoinCode($joinCode: String!) {
    events(where: { join_code: { _eq: $joinCode } }, limit: 1) {
      id
      name
      join_code
      status
      start_time
      end_time
    }
  }
`;
