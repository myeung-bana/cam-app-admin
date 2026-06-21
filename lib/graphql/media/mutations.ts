import { gql } from "graphql-tag";

export const UPDATE_MEDIA = gql`
  mutation UpdateMedia($id: uuid!, $set: media_set_input!) {
    update_media_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
      event_id
      file_url
      storage_file_id
      file_type
      filter_applied
      challenge_id
      uploaded_at
      is_hidden
      is_starred
      session {
        display_name
      }
    }
  }
`;

export const INSERT_MEDIA = gql`
  mutation InsertMedia($object: media_insert_input!) {
    insert_media_one(object: $object) {
      id
      event_id
      file_url
      storage_file_id
      file_type
      filter_applied
      uploaded_at
      is_hidden
      is_starred
    }
  }
`;
