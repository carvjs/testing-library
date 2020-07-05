import { start } from '@carv/runtime'

import App from './app.svelte'
import extensionPoints from './extension-points'

const app = start(App, { extensionPoints })

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot?.accept()
  import.meta.hot?.dispose(() => {
    try {
      app.$destroy()
    } catch {
      document.body.innerHTML = ''
    }
  })
}
