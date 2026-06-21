import { gql } from "graphql-tag";

export const INSERT_EVENT_TYPE = gql`
  mutation InsertEventType($object: event_types_insert_input!) {
    insert_event_types_one(object: $object) {
      id
      slug
      label
      description
      sort_order
      active
      created_at
      updated_at
    }
  }
`;

export const UPDATE_EVENT_TYPE = gql`
  mutation UpdateEventType($id: uuid!, $set: event_types_set_input!) {
    update_event_types_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
      slug
      label
      description
      sort_order
      active
      created_at
      updated_at
    }
  }
`;

export const INSERT_CHALLENGE_TEMPLATE = gql`
  mutation InsertChallengeTemplate($object: challenge_templates_insert_input!) {
    insert_challenge_templates_one(object: $object) {
      id
      slug
      label
      description
      icon
      is_required
      event_type_slug
      sort_order
      active
      created_at
      updated_at
    }
  }
`;

export const UPDATE_CHALLENGE_TEMPLATE = gql`
  mutation UpdateChallengeTemplate(
    $id: uuid!
    $set: challenge_templates_set_input!
  ) {
    update_challenge_templates_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
      slug
      label
      description
      icon
      is_required
      event_type_slug
      sort_order
      active
      created_at
      updated_at
    }
  }
`;
