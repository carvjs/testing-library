<script lang="typescript">
  import { Delay, ExtensionPoint, useQuery } from '@carv/runtime'

  import favicon from './favicon.png'

  import * as q from './queries'

  const fetchMe = useQuery<q.FetchMe>(q.fetchMe)

  let error: Error | undefined
  $: error = $fetchMe.error

  let me: q.FetchMe['me'] | undefined | null
  $: me = $fetchMe.data?.me
</script>

<svelte:head>
  <title>Runtime Preview</title>
  <link rel="icon" type="image/png" href={favicon} />
</svelte:head>

{#if $fetchMe.fetching}
  <Delay>
    <ExtensionPoint id="loading" variant="small">Loading...</ExtensionPoint>
  </Delay>
{:else if error}
  <ExtensionPoint id="error" {error}>Oh no! {error.message}</ExtensionPoint>
{:else}
  <ExtensionPoint id="me" {me}>
    {#if me}
      <h1>Hello {me.firstName || ''} {me.lastName || ''}</h1>
    {/if}
  </ExtensionPoint>
{/if}

<style src="./app.css">

</style>
