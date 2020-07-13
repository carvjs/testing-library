import { readable } from 'svelte/store'
import { initGraphQLClient, GraphQLResponse } from '@carv/runtime'
import type { GraphQLClient } from '@carv/runtime'

import type { MockedRequest, MockedResponse } from '../types'

const mock = (mockedRequest: MockedRequest) => (query: string, variables = {}, options = {}) => {
  return readable<GraphQLResponse>({ fetching: false }, (set) => {
    set({ fetching: true })

    // eslint-disable-next-line promise/catch-or-return, @typescript-eslint/no-floating-promises
    new Promise<MockedResponse>((resolve) => {
      resolve(mockedRequest(query, variables, options))
    })
      .catch((error: Error) => ({ error }))
      .then((result = { error: new Error('not mocked') }) => set({ ...result, fetching: false }))
  })
}

const fail = (): ReturnType<MockedRequest> => {
  throw new Error('not mocked')
}

export function initMockedGraphQLClient(request: MockedRequest = fail): GraphQLClient {
  const client = initGraphQLClient({ url: 'http://local.lan/graphql' })

  client.request = mock(request) as GraphQLClient['request']

  return client
}
