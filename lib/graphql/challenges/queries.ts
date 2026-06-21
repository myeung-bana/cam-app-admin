import { gql } from "graphql-tag";

export const GET_EVENT_CHALLENGES = gql`
  query GetEventChallenges($eventId: uuid!) {
    challenges(
      where: { event_id: { _eq: $eventId } }
      order_by: { sort_order: asc }
    ) {
      id
      event_id
      title
      description
      icon
      is_required
      sort_order
    }
  }
`;

export const GET_CHALLENGE_TEMPLATES_BY_EVENT_TYPE = gql`
  query GetChallengeTemplatesByEventType($eventTypeSlug: String!) {
    challenge_templates(
      where: {
        active: { _eq: true }
        event_type_slug: { _eq: $eventTypeSlug }
      }
      order_by: { sort_order: asc }
    ) {
      slug
      label
      description
      icon
      is_required
      sort_order
    }
  }
`;
