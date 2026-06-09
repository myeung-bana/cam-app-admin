import { gql } from "graphql-tag";

export const INSERT_CLIENT = gql`
  mutation InsertClient($object: clients_insert_input!) {
    insert_clients_one(object: $object) {
      id
      name
      email
      phone
      wedding_date
      notes
      archived
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: uuid!, $set: clients_set_input!) {
    update_clients_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
      name
      email
      phone
      wedding_date
      notes
      archived
    }
  }
`;
