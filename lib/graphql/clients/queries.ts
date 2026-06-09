import { gql } from "graphql-tag";

export const GET_CLIENTS = gql`
  query GetClients {
    clients(
      where: { archived: { _eq: false } }
      order_by: { name: asc }
    ) {
      id
      name
      email
      phone
      wedding_date
      notes
      archived
      created_at
    }
  }
`;

export const GET_CLIENT_BY_ID = gql`
  query GetClientById($id: uuid!) {
    clients_by_pk(id: $id) {
      id
      name
      email
      phone
      wedding_date
      notes
      archived
      created_at
      updated_at
    }
  }
`;
