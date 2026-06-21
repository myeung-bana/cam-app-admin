import { gql } from "graphql-tag";

export const GET_ADMIN_USERS = gql`
  query GetAdminUsers {
    admin_users(order_by: { name: asc }) {
      id
      name
      email
      role
      status
      phone
      notes
      last_login_at
      created_at
      updated_at
    }
  }
`;

export const GET_ADMIN_USER_BY_ID = gql`
  query GetAdminUserById($id: uuid!) {
    admin_users_by_pk(id: $id) {
      id
      name
      email
      role
      status
      phone
      notes
      last_login_at
      created_at
      updated_at
    }
  }
`;

export const GET_ADMIN_USER_BY_EMAIL = gql`
  query GetAdminUserByEmail($email: String!) {
    admin_users(where: { email: { _eq: $email } }, limit: 1) {
      id
      email
    }
  }
`;
