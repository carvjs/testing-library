import { setContext } from 'svelte'

import { initRuntime } from '@carv/runtime'
import type { Runtime } from '@carv/runtime'

import type { MockedIdentityHub } from '../types'
import { initMockIdentityHub } from '../internal/identity-hub'

export function initMockRuntime({ hub }: { hub?: MockedIdentityHub } = {}): Runtime {
  const runtime = Object.assign(initRuntime(), { hub: initMockIdentityHub(hub) })

  setContext('@carv/runtime', runtime)

  return runtime
}
