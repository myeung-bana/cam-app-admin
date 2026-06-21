import { gql } from "graphql-tag";

export const INSERT_EVENT = gql`
  mutation InsertEvent($object: events_insert_input!) {
    insert_events_one(object: $object) {
      id
      name
      status
      start_time
      end_time
      venue_name
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

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: uuid!, $set: events_set_input!) {
    update_events_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
      name
      status
      start_time
      end_time
      venue_name
      max_attendees
      join_code
      qr_access_enabled
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

export const ROTATE_JOIN_CODE = gql`
  mutation RotateJoinCode($id: uuid!, $joinCode: String!, $rotatedAt: timestamptz!) {
    update_events_by_pk(
      pk_columns: { id: $id }
      _set: { join_code: $joinCode, join_code_rotated_at: $rotatedAt }
    ) {
      id
      join_code
      join_code_rotated_at
    }
  }
`;
