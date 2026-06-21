import { gql } from "graphql-tag";

export const GET_DASHBOARD_METRICS = gql`
  query GetDashboardMetrics($weekAgo: timestamptz!) {
    live_events: events_aggregate(where: { status: { _eq: live } }) {
      aggregate {
        count
      }
    }
    uploads_week: media_aggregate(
      where: { uploaded_at: { _gte: $weekAgo } }
    ) {
      aggregate {
        count
      }
    }
    clients_active: clients_aggregate(where: { archived: { _eq: false } }) {
      aggregate {
        count
      }
    }
    reels_delivered: reels_aggregate(
      where: {
        status: { _eq: ready }
        published_at: { _is_null: false }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_UPCOMING_EVENTS = gql`
  query GetUpcomingEvents($from: timestamptz!, $to: timestamptz!) {
    events(
      where: {
        start_time: { _gte: $from, _lte: $to }
        status: { _in: [draft, ready, live] }
      }
      order_by: { start_time: asc }
      limit: 10
    ) {
      id
      name
      status
      start_time
      client_id
      client {
        id
        name
        email
      }
    }
  }
`;

export const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity($limit: Int!) {
    activity_log(order_by: { created_at: desc }, limit: $limit) {
      id
      type
      label
      entity_ref
      created_at
    }
  }
`;
