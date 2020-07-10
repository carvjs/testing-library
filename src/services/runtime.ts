import { initRuntime } from '@carv/runtime'

import type { MockedRequest } from '../types'
import { initMockedGraphQLClient } from '../internal/graphql'

export function initMockRuntime({ request }: { request?: MockedRequest } = {}): void {
  initRuntime()
  initMockedGraphQLClient(request)
}
