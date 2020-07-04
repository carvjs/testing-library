import { DocumentNode, parse } from 'graphql'
import { fromValue, fromPromise, map, Source, toPromise, take } from 'wonka'
import {
  CombinedError,
  OperationResult,
  OperationContext,
  PromisifiedSource,
  OperationType,
} from '@urql/core'
import { initClient, query, mutate, subscription } from '@urql/svelte'
import isPromise from 'is-promise'

import type { IdentityHub } from '@carv/runtime'

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

const toResult = (
  type: 'query' | 'mutate' | 'subscribe',
  query: string | DocumentNode,
  variables: Record<string, unknown> | undefined,
  context: Partial<OperationContext> | undefined,
  callback: () => MockedResult | undefined,
  // eslint-disable-next-line max-params
): PromisifiedSource => {
  let result
  try {
    result = callback()
  } catch (error) {
    result = fail(error)
  }

  if (result === undefined) result = fail(`hub.${type}() is not mocked`)

  if (typeof result !== 'function') {
    result = isPromise(result) ? fromPromise(result) : fromValue(result)
  }

  const key = ++operationKey

  return withPromise(
    map(
      (
        operationResult: MockedResult = fail(`hub.${type}() mock did return undefined`),
      ): OperationResult => ({
        operation: {
          key,
          // 'subscription' | 'query' | 'mutation' | 'teardown'
          operationName: TYPE_TO_OPERATION_NAME[type],
          query: typeof query === 'string' ? parse(query) : query,
          variables,
          context: { url: 'mock', requestPolicy: 'network-only', ...context },
        },
        ...operationResult,
      }),
    )(result),
  )
}

export function initMockIdentityHub(hub: MockedIdentityHub = {}): IdentityHub {
  const client = initClient({ url: 'http://identity-hub.local' })

  Object.assign(client, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: <Data = any, Variables extends Record<string, unknown> = Record<string, unknown>>(
      query: DocumentNode | string,
      variables?: Variables,
      context: Partial<OperationContext> = {},
    ): Source<OperationResult<Data>> =>
      toResult(
        'query',
        query,
        variables,
        context,
        () =>
          hub.query &&
          hub.query(query, {
            variables,
            requestPolicy: context.requestPolicy || 'network-only',
            pollInterval: context.pollInterval,
            context,
          }),
      ),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutate: <Data = any, Variables extends Record<string, unknown> = Record<string, unknown>>(
      query: DocumentNode | string,
      variables?: Variables,
      context?: Partial<OperationContext>,
    ): Source<OperationResult<Data>> =>
      toResult(
        'mutate',
        query,
        variables,
        context,
        () => hub.mutate && hub.mutate(query, { variables, context }),
      ),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscribe: <Data = any, Variables extends Record<string, unknown> = Record<string, unknown>>(
      query: DocumentNode | string,
      variables?: Variables,
      context?: Partial<OperationContext>,
    ): Source<OperationResult<Data>> =>
      toResult(
        'subscribe',
        query,
        variables,
        context,
        () => hub.subscribe && hub.subscribe(query, { variables, context }),
      ),
  })

  return {
    query: (gql, args) => query({ ...args, query: gql }),
    mutate: (gql, args) => mutate({ ...args, query: gql }),
    subscribe: (gql, { handler, ...args } = {}) => subscription({ ...args, query: gql }, handler),
  }
}
