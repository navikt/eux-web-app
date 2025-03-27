export default import.meta.env.NODE_ENV
export const IS_DEVELOPMENT = import.meta.env.NODE_ENV === 'development'
export const IS_PRODUCTION = import.meta.env.NODE_ENV === 'production'
export const IS_TEST = import.meta.env.NODE_ENV === 'test'

export const IS_Q = window.location.hostname.endsWith('preprod.local')
export const IS_P = window.location.hostname.endsWith('adeo.no')

export const APP_VERSION = import.meta.env.VITE_APP_VERSION
export const APP_BUILD_DATETIME = import.meta.env.VITE_APP_BUILD_DATETIME
export const APP_BUILD_VERSION = import.meta.env.VITE_APP_BUILD_VERSION
export const APP_BRANCH_NAME = import.meta.env.VITE_APP_BRANCH_NAME
export const APP_EESSI_KODEVERK = import.meta.env.VITE_APP_EESSI_KODEVERK
export const APP_REACT_LIB = import.meta.env.VITE_APP_REACT_LIB
