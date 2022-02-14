export default process.env.NODE_ENV
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_TEST = process.env.NODE_ENV === 'test'

export const IS_Q = window.location.hostname.endsWith('preprod.local')
export const IS_P = window.location.hostname.endsWith('adeo.no')
