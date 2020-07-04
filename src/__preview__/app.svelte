<script lang="typescript">
  import type { CombinedError } from '@urql/core'
  import { getContext } from 'svelte'

  import * as q from './queries'

  const { hub, ExtensionPoint } = getContext('@carv/runtime')

  const fetchMe = hub.query<q.FetchMe>(q.fetchMe)

  let error: CombinedError | undefined
  $: error = $fetchMe.error

  let data: q.FetchMe | undefined
  $: data = $fetchMe.data

  let me: q.FetchMe['me'] | undefined | null
  $: me = data && data.me
</script>

<svelte:head>
  <title>Runtime Preview</title>
</svelte:head>

{#if $fetchMe.fetching}
  <ExtensionPoint id="loading" variant="small">Loading...</ExtensionPoint>
{:else if error}
  <ExtensionPoint id="error" {error}>Oh no! {error.message}</ExtensionPoint>
{:else}
  <ExtensionPoint id="me" {me}>
    {#if me}
      <h1>Hello {me.firstName || ''} {me.lastName || ''}</h1>
    {/if}
  </ExtensionPoint>
{/if}
