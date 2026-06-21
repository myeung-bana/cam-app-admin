import { gql } from "graphql-tag";

export const GET_CLIENTS = gql`
  query GetClients {
    clients(
      where: { archived: { _eq: false } }
      order_by: { name: asc }
    ) {
      id
      name
      organisation
      email
      phone
      wedding_date
      event_type_preference
      notes
      status
      portal_last_login_at
      archived
      created_at
      updated_at
    }
  }
`;

export const GET_CLIENT_BY_ID = gql`
  query GetClientById($id: uuid!) {
    clients_by_pk(id: $id) {
      id
      name
      organisation
      email
      phone
      wedding_date
      event_type_preference
      notes
      status
      portal_last_login_at
      archived
      created_at
      updated_at
    }
  }
`;

export const GET_CLIENT_EVENTS = gql`
  query GetClientEvents($clientId: uuid!) {
    events(
      where: { client_id: { _eq: $clientId } }
      order_by: { start_time: desc }
    ) {
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
