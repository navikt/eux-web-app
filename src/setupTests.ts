import Enzyme, { mount, render, shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { act } from 'react-dom/test-utils'
import { useDispatch, useSelector } from 'react-redux'
import 'jest-styled-components'

jest.mock('react-redux')

Enzyme.configure({ adapter: new Adapter() });

(global as any).shallow = shallow;
(global as any).render = render;
(global as any).mount = mount;
(global as any).act = act

// eslint-disable-next-line no-undef
HTMLCanvasElement.prototype.getContext = jest.fn()
window.scrollTo = jest.fn()

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ('')
  })
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
    use: use,
    init: init,
    loadLanguages: loadLanguages
  }
  use.mockImplementation(() => result)
  return result
})

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key })
}));

export const stageSelector = (defaultSelector: any, params: any) => {
  (useDispatch as jest.Mock).mockImplementation(() => jest.fn());
  (useSelector as jest.Mock).mockImplementation(() => ({
    ...defaultSelector,
    ...params
  }))
}
