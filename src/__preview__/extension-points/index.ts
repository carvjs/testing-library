/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export default {
  me: () => import('./me.svelte'),
  // Allow package names: me: '@schwarz/me@2.x'),
}

/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
