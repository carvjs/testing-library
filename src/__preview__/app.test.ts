import { render, screen, MockedIdentityHub } from '../main'

import App from './app.svelte'
import extensionPoints from './extension-points'
import * as q from './queries'

test('uses graphql and "me" extension point', async () => {
  const hub: MockedIdentityHub = {
    query: (query) => {
      if (query === q.fetchMe) {
        return {
          data: {
            me: {
              id: 'testid',
              firstName: 'Test',
              lastName: 'User',
              mail: ['test.user@x.com'],
            },
          },
        }
      }
    },
  }

  render(App, { extensionPoints, hub })

  const welcome = await screen.findByText(/hello test user/i)
  expect(welcome).toBeInTheDocument()

  // Should have used extension point to render the welcome message
  const mail = await screen.findByText(/test.user@x.com/i)
  expect(mail).toBeInTheDocument()
})
