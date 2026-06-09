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
      client {
        id
        name
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
      client {
        id
        name
      }
    }
  }
`;
