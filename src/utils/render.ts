import type { SvelteComponent } from 'svelte'
import * as lib from '@testing-library/svelte'

import type { Loader } from '@carv/runtime'

import type { MockedIdentityHub } from '../types'
import MockRuntimeProvider from '../components/mock-provider.svelte'

export interface ComponentOptions {
  extensionPoints?: Record<string, string | Loader>
  hub?: MockedIdentityHub
  props?: Record<string, unknown>
}

export function render(
  component: typeof SvelteComponent,
  { hub, extensionPoints, props }: ComponentOptions = {},
  renderOptions?: Omit<lib.RenderOptions, 'queries'>,
): lib.RenderResult {
  return lib.render(
    MockRuntimeProvider,
    { props: { component, hub, extensionPoints, props } },
    renderOptions,
  )
}
