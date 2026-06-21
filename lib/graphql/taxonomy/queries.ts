import { gql } from "graphql-tag";

const EVENT_TYPE_FIELDS = gql`
  fragment EventTypeFields on event_types {
    id
    slug
    label
    description
    sort_order
    active
    created_at
    updated_at
  }
`;

export const GET_EVENT_TYPE_TAXONOMY = gql`
  ${EVENT_TYPE_FIELDS}
  query GetEventTypeTaxonomy {
    event_types(
      where: { active: { _eq: true } }
      order_by: [{ sort_order: asc }, { label: asc }]
    ) {
      ...EventTypeFields
    }
  }
`;

export const GET_ALL_EVENT_TYPE_TAXONOMY = gql`
  ${EVENT_TYPE_FIELDS}
  query GetAllEventTypeTaxonomy {
    event_types(order_by: [{ sort_order: asc }, { label: asc }]) {
      ...EventTypeFields
    }
  }
`;

export const GET_EVENT_TYPE_TAXONOMY_BY_ID = gql`
  ${EVENT_TYPE_FIELDS}
  query GetEventTypeTaxonomyById($id: uuid!) {
    event_types_by_pk(id: $id) {
      ...EventTypeFields
    }
  }
`;

const CHALLENGE_TEMPLATE_FIELDS = gql`
  fragment ChallengeTemplateFields on challenge_templates {
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
`;

export const GET_CHALLENGE_TAXONOMY = gql`
  ${CHALLENGE_TEMPLATE_FIELDS}
  query GetChallengeTaxonomy {
    challenge_templates(
      where: { active: { _eq: true } }
      order_by: [{ sort_order: asc }, { label: asc }]
    ) {
      ...ChallengeTemplateFields
    }
  }
`;

export const GET_ALL_CHALLENGE_TAXONOMY = gql`
  ${CHALLENGE_TEMPLATE_FIELDS}
  query GetAllChallengeTaxonomy {
    challenge_templates(order_by: [{ sort_order: asc }, { label: asc }]) {
      ...ChallengeTemplateFields
    }
  }
`;

export const GET_CHALLENGE_TAXONOMY_BY_ID = gql`
  ${CHALLENGE_TEMPLATE_FIELDS}
  query GetChallengeTaxonomyById($id: uuid!) {
    challenge_templates_by_pk(id: $id) {
      ...ChallengeTemplateFields
    }
  }
`;
