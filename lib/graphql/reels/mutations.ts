import { gql } from "graphql-tag";

export const INSERT_REEL = gql`
  mutation InsertReel($object: reels_insert_input!) {
    insert_reels_one(object: $object) {
      id
      event_id
      output_url
      status
      music_track
      description
      published_at
      created_at
    }
  }
`;

export const UPDATE_REEL = gql`
  mutation UpdateReel($id: uuid!, $set: reels_set_input!) {
    update_reels_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
      event_id
      output_url
      status
      music_track
      description
      published_at
      created_at
    }
  }
`;
