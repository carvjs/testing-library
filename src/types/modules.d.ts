declare module 'svelte-loadable' {
  import { SvelteComponent } from 'svelte'

  const Loadable: typeof SvelteComponent

  export default Loadable

  export type Loader = () => Promise<{ default: typeof SvelteComponent }>

  export function register(options: { loader: Loader; resolve: () => string }): Loader

  export function preloadAll(): Promise<void>
}
