// Declare common modules like importing assets
import '@carv/types'

import { RuntimeProvider } from '@carv/runtime'

import App from './app.svelte'
import extensionPoints from './extension-points'

const app = new RuntimeProvider({
  target: document.body,
  props: { component: App, extensionPoints },
})

export default app

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot?.accept()
  import.meta.hot?.dispose(() => {
    app.$destroy()
  })
}
