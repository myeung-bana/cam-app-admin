import { gql } from "graphql-tag";

const AUTH_USER_FIELDS = `
  id
  email
  displayName
  disabled
  lastSeen
  createdAt
  updatedAt
  phoneNumber
  metadata
  roles {
    role
  }
`;

export const GET_ADMIN_USERS = gql`
  query GetAdminUsers {
    users(
      where: { roles: { role: { _eq: "admin" } } }
      order_by: { displayName: asc }
    ) {
      ${AUTH_USER_FIELDS}
    }
  }
`;

export const GET_ADMIN_USER_BY_ID = gql`
  query GetAdminUserById($id: uuid!) {
    user(id: $id) {
      ${AUTH_USER_FIELDS}
    }
  }
`;

export const GET_ADMIN_USER_BY_EMAIL = gql`
  query GetAdminUserByEmail($email: String!) {
    users(
      where: {
        email: { _eq: $email }
        roles: { role: { _eq: "admin" } }
      }
      limit: 1
    ) {
      id
      email
    }
  }
`;
