import { readable } from 'svelte/store'
import { initGraphQLClient, GraphQLRequest, GraphQLResponse } from '@carv/runtime'
import type { GraphQLClient } from '@carv/runtime'

import type { MockedRequest, MockedResponse } from '../types'

const mock = (mockedRequest: MockedRequest) => (query: string, variables = {}, options = {}) => {
  const request: GraphQLRequest = { query, variables }

  return readable<GraphQLResponse>({ request, fetching: false }, (set) => {
    set({ request, fetching: true })

    // eslint-disable-next-line promise/catch-or-return, @typescript-eslint/no-floating-promises
    new Promise<MockedResponse>((resolve) => {
      resolve(mockedRequest(query, variables, options))
    })
      .catch((error: Error) => ({
        error: Object.assign(error, { request }),
      }))
      .then((result = { error: Object.assign(new Error('not mocked'), { request }) }) =>
        set({ request, fetching: false, ...result }),
      )
  })
}

const fail = (): ReturnType<MockedRequest> => {
  throw new Error('not mocked')
}

export function initMockedGraphQLClient(request: MockedRequest = fail): GraphQLClient {
  const client = initGraphQLClient('http://local.lan/graphql')

  client.request = mock(request) as GraphQLClient['request']

  return client
}
