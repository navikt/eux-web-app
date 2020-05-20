import * as Sentry from '@sentry/browser'

export const init = () => {
  Sentry.init({
    dsn: 'https://75ab286ed1694147b461d6abf6a86212@sentry.gc.nav.no/32',
    release: process.env.GIT_COMMIT_HASH || 'unknown',
    environment: window.location.hostname
  })
}
