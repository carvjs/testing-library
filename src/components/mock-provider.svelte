<script lang="typescript">
  import type { SvelteComponent } from 'svelte'
  import type { Loader } from '@carv/runtime'
  import { addExtensionPoints } from '@carv/runtime'

  import type { MockedRequest } from '../types'
  import { initMockRuntime } from '../services/runtime'

  export let request: MockedRequest | undefined = undefined
  export let extensionPoints: Record<string, string | Loader> | undefined | null = undefined
  export let component: typeof SvelteComponent | undefined = undefined
  export let props: Record<string, unknown> | undefined = undefined

  initMockRuntime({ request })

  // This should be reactive. But svelte-check fails.
  if (extensionPoints) {
    addExtensionPoints(extensionPoints)
  }
</script>

{#if component}
  <svelte:component this={component} {...$$restProps} {...props} />
{:else}
  <slot />
{/if}
