/**
 * This export is required for snowpack to include this file in the output.
 */
export default void 0 // eslint-disable-line no-void

import type { Source } from 'wonka'
import type { OperationResult, OperationContext } from '@urql/core'
import type { DocumentNode } from 'graphql'

export type MaybeSource<T> = T | Source<T> | Promise<T>
export type MockedResult = MaybeSource<Omit<OperationResult, 'operation'>>

export interface MockedIdentityHub {
  query?: <V extends Record<string, unknown> = Record<string, unknown>>(
    gql: string | DocumentNode,
    variables?: Partial<V>,
    context?: Partial<OperationContext>,
  ) => MockedResult | undefined

  // Mutate?: <V extends Record<string, unknown> = Record<string, unknown>>(
  //   mutation: MutationArguments<V>['query'],
  //   args?: Omit<MutationArguments<V>, 'query'>,
  // ) => MockedResult | undefined

  // subscribe?: <V extends Record<string, unknown> = Record<string, unknown>>(
  //   mutation: SubscriptionArguments<V>['query'],
  //   args?: Omit<SubscriptionArguments<V>, 'query'> & {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     handler?: SubscriptionHandler<any, any> | undefined
  //   },
  // ) => MockedResult | undefined
}
