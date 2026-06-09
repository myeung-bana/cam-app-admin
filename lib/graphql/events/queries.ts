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
      client {
        id
        name
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
      qr_image_url
      cover_image_url
      client {
        id
        name
        email
      }
    }
  }
`;
