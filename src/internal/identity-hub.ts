import { parse } from 'graphql'
import { fromValue, fromPromise, map, Source, toPromise, take } from 'wonka'
import {
  CombinedError,
  OperationResult,
  PromisifiedSource,
  OperationType,
  Client,
} from '@urql/core'
import isPromise from 'is-promise'
import { getContext } from 'svelte'

import type { MockedIdentityHub, MockedResult } from '../types'

const fail = <T>(error: Error | string): Omit<OperationResult<T>, 'operation'> => ({
  error: new CombinedError({
    networkError: typeof error === 'string' ? new Error(error) : error,
  }),
})

const withPromise = <T>(a: Source<T>): PromisifiedSource<T> =>
  Object.assign(a as PromisifiedSource<T>, {
    toPromise: () => toPromise(take(1)(a)),
  })

let operationKey = 0

const TYPE_TO_OPERATION_NAME: { [key: string]: OperationType } = {
  query: 'query',
  mutate: 'mutation',
  subscribe: 'subscription',
}

const mock = <T extends 'query'>(hub: MockedIdentityHub, type: T): Client[T] => (
  query,
  variables,
  context,
) => {
  let result
  try {
    result = hub[type]?.(query, variables, context) ?? fail(`${type}() is not mocked`)
  } catch (error) {
    result = fail(error)
  }

  if (typeof result !== 'function') {
    result = isPromise(result) ? fromPromise(result) : fromValue(result)
  }

  const key = ++operationKey

  return withPromise(
    map(
      (
        operationResult: MockedResult = fail(`${type}() mock did return undefined`),
      ): OperationResult => ({
        operation: {
          key,
          // 'subscription' | 'query' | 'mutation' | 'teardown'
          operationName: TYPE_TO_OPERATION_NAME[type],
          query: typeof query === 'string' ? parse(query) : query,
          variables,
          context: { url: 'http://local.mock', requestPolicy: 'network-only', ...context },
        },
        ...operationResult,
      }),
    )(result),
  )
}

// Same as https://github.com/FormidableLabs/urql/blob/main/packages/svelte-urql/src/context.ts#L4
const CLIENT = '$$_URQL'

export function initMockIdentityHub(hub: MockedIdentityHub = {}): void {
  const client = getContext(CLIENT) as Client

  Object.assign(client, {
    query: mock(hub, 'query'),

    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // mutate: <Data = any, Variables extends Record<string, unknown> = Record<string, unknown>>(
    //   query: DocumentNode | string,
    //   variables?: Variables,
    //   context?: Partial<OperationContext>,
    // ): Source<OperationResult<Data>> =>
    //   toResult(
    //     'mutate',
    //     query,
    //     variables,
    //     context,
    //     () => hub.mutate && hub.mutate(query, { variables, context }),
    //   ),

    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // subscribe: <Data = any, Variables extends Record<string, unknown> = Record<string, unknown>>(
    //   query: DocumentNode | string,
    //   variables?: Variables,
    //   context?: Partial<OperationContext>,
    // ): Source<OperationResult<Data>> =>
    //   toResult(
    //     'subscribe',
    //     query,
    //     variables,
    //     context,
    //     () => hub.subscribe && hub.subscribe(query, { variables, context }),
    //   ),
  })
}
