import { GraphQLError, GraphQLExtensions, GraphQLRequestOptions } from '@carv/runtime'

/**
 * This is required for snowpack to include this file in the output.
 */
const MAKE_SNOWPACK_HAPPY = undefined // eslint-disable-line @typescript-eslint/no-unused-vars

/* eslint-disable @typescript-eslint/no-explicit-any */
export type MaybePromise<T> = T | Promise<T>
export type MockedResult<T = any> = MaybePromise<MockedResponse<T>>

export interface MockedResponse<T = any> {
  readonly data?: T
  readonly errors?: GraphQLError[]
  readonly extensions?: GraphQLExtensions
}

export type MockedRequest<T = any, V extends Record<string, any> = Record<string, any>> = (
  gql: string,
  variables: V,
  options: GraphQLRequestOptions,
) => MockedResult<T> | undefined
/* eslint-enable @typescript-eslint/no-explicit-any */
