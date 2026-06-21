import { gql } from "graphql-tag";

export const INSERT_ADMIN_USER = gql`
  mutation InsertAdminUser($object: admin_users_insert_input!) {
    insert_admin_users_one(object: $object) {
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

export const UPDATE_ADMIN_USER = gql`
  mutation UpdateAdminUser($id: uuid!, $set: admin_users_set_input!) {
    update_admin_users_by_pk(pk_columns: { id: $id }, _set: $set) {
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
