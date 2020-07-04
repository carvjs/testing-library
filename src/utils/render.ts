import type { SvelteComponent } from 'svelte'
import * as lib from '@testing-library/svelte'

import type { Loader } from '@carv/runtime'

import type { MockedIdentityHub } from '../types'
import MockRuntimeProvider from '../components/mock-provider.svelte'

export interface ComponentOptions {
  props?: Record<string, unknown>
  hub?: MockedIdentityHub
  extensionPoints?: Record<string, string | Loader>
}

export function render(
  component: typeof SvelteComponent,
  { hub, extensionPoints, props: args }: ComponentOptions = {},
  renderOptions?: Omit<lib.RenderOptions, 'queries'>,
): lib.RenderResult {
  return lib.render(
    MockRuntimeProvider,
    { props: { component, extensionPoints, hub, args } },
    renderOptions,
  )
}
