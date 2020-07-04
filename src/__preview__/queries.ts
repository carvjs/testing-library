import gql from 'fake-tag'

import type { FetchMe } from './__generated__/fetch-me'

export type { FetchMe }
export const fetchMe = gql`
  query FetchMe {
    me {
      id
      entryUUID
      firstName
      lastName
      mail
      photo
    }
  }
`
