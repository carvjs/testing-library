import { initRuntime } from '@carv/runtime'

import type { MockedIdentityHub } from '../types'
import { initMockIdentityHub } from '../internal/identity-hub'

export function initMockRuntime({ hub }: { hub?: MockedIdentityHub } = {}): void {
  initRuntime()
  initMockIdentityHub(hub)
}
