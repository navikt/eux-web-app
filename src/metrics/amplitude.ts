import amplitude from 'amplitude-js'

const isProduction = () => {
  const host = window?.location?.hostname || ''
  return host === 'eux-helloeu-app.nais.adeo.no'
}

const isLocalhost = () => {
  const host = window?.location?.hostname || ''
  return host === 'localhost'
}

const getApiKey = () => {
  return isProduction()
    ? 'a9a60eb3e832909758c46016e1714d3e'
    : 'feb0ead20059b4be531bfa6e076906ab'
}

const debug = false

const config = {
  apiEndpoint: 'amplitude.nav.no/collect',
  saveEvents: true,
  includeUtm: true,
  includeReferrer: true,
  trackingOptions: {
    city: false,
    ip_address: false,
    region: false
  }
}

export const init = () => {
  if (!isLocalhost()) {
    amplitude.getInstance().init(getApiKey(), undefined, config)
  }
}

export type AmplitudeLogger = (name: string, values?: object) => void;

export const amplitudeLogger = (name: string, values?: object) => {
  const data = values || {}
  const key = `#neessi.${name}`
  if (debug) {
    console.log('Amplitude:', key, data)
  }
  if (!isLocalhost()) {
    amplitude.getInstance().logEvent(key, data)
  }
}
