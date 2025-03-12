export default import.meta.env.NODE_ENV
export const IS_DEVELOPMENT = import.meta.env.NODE_ENV === 'development'
export const IS_PRODUCTION = import.meta.env.NODE_ENV === 'production'
export const IS_TEST = import.meta.env.NODE_ENV === 'test'

export const IS_Q = window.location.hostname.endsWith('preprod.local')
export const IS_P = window.location.hostname.endsWith('adeo.no')
