export * from './types'

export { default as MockProvider } from './components/mock-provider.svelte'
export * from './services/runtime'
export * from './utils/render'

export {
  createEvent,
  getNodeText,
  prettyDOM,
  getQueriesForElement,
  isInaccessible,
  within,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/dom'
export { screen, fireEvent, act, cleanup } from '@testing-library/svelte'
export type { RenderResult, RenderOptions, FireFunction, FireObject } from '@testing-library/svelte'
export { default as userEvent } from '@testing-library/user-event'

export { default as html } from 'svelte-htm'

export * from 'wonka'
