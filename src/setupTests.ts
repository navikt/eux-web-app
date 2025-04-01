import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { useDispatch, useSelector } from 'react-redux'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

jest.mock('react-redux');

(global as any).screen = screen;
(global as any).render = render;
(global as any).act = act

// eslint-disable-next-line no-undef
HTMLCanvasElement.prototype.getContext = jest.fn()
window.scrollTo = jest.fn()

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ('')
  })
})

jest.mock('constants/environment.ts', () => {
  return {
    IS_DEVELOPMENT: 'development',
    IS_PRODUCTION: 'production',
    IS_TEST: true,
    APP_VERSION: "TEST",
    APP_BUILD_DATETIME: "01-01-2025",
    APP_BUILD_VERSION: "TEST",
    APP_BRANCH_NAME: "TEST",
    APP_EESSI_KODEVERK: "TEST",
    APP_REACT_LIB: "TEST"
  };
})

jest.mock('amplitude-js', () => ({
  getInstance: () => ({
    init: jest.fn(),
    logEvent: jest.fn()
  })
}))

jest.mock('i18next', () => {
  const use = jest.fn()
  const init = jest.fn()
  const loadLanguages = jest.fn()
  const result = {
    use,
    init,
    loadLanguages
  }
  use.mockImplementation(() => result)
  return result
})

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key })
}))

export const stageSelector = (defaultSelector: any, params: any) => {
  (useDispatch as jest.Mock).mockImplementation(() => jest.fn());
  (useSelector as jest.Mock).mockImplementation(() => ({
    ...defaultSelector,
    ...params
  }))
}
