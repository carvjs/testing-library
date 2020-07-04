<script lang="typescript">
  import * as q from '../queries'

  export let me: q.FetchMe['me'] | undefined
</script>

<h1>
  Hello
  {#if me}{me.firstName || ''} {me.lastName || ''} - {me.mail.join(', ')}{/if}
</h1>
