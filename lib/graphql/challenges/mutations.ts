import { gql } from "graphql-tag";

export const DELETE_EVENT_CHALLENGES = gql`
  mutation DeleteEventChallenges($eventId: uuid!) {
    delete_challenges(where: { event_id: { _eq: $eventId } }) {
      affected_rows
    }
  }
`;

export const INSERT_CHALLENGES = gql`
  mutation InsertChallenges($objects: [challenges_insert_input!]!) {
    insert_challenges(objects: $objects) {
      returning {
        id
        event_id
        title
        description
        icon
        is_required
        sort_order
      }
    }
  }
`;
