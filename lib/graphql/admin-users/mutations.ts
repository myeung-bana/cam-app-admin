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

export const UPDATE_ADMIN_USER = gql`
  mutation UpdateAdminUser($id: uuid!, $set: users_set_input!) {
    updateUser(pk_columns: { id: $id }, _set: $set) {
      ${AUTH_USER_FIELDS}
    }
  }
`;
