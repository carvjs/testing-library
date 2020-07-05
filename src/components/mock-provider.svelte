<script lang="typescript">
  import type { SvelteComponent } from 'svelte/internal'
  import type { Loader } from '@carv/runtime'

  import type { MockedIdentityHub } from '../types'
  import { initMockRuntime } from '../services/runtime'

  export let hub: Partial<MockedIdentityHub> | undefined = undefined
  export let extensionPoints: Record<string, string | Loader> | undefined | null = undefined
  export let component: typeof SvelteComponent | undefined = undefined
  export let props: Record<string, unknown> | undefined = undefined

  const { addExtensionPoints } = initMockRuntime({ hub })

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
