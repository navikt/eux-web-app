import { clientClear } from 'actions/alert'
import { closeModal, toggleHighContrast } from 'actions/ui'
import { ModalContent } from 'eessi-pensjon-ui/dist/declarations/components'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TopContainer, TopContainerProps, TopContainerSelector } from './TopContainer'

jest.mock('react-redux');
(useDispatch as jest.Mock).mockImplementation(() => jest.fn())

const defaultSelector: TopContainerSelector = {
  clientErrorStatus: 'ERROR',
  clientErrorMessage: 'mockErrorMessage',
  serverErrorMessage: undefined,
  error: undefined,
  expirationTime: undefined,
  params: {},
  username: 'mockUsername',
  gettingUserInfo: false,
  isLoggingOut: false,
  footerOpen: false,
  modal: undefined,
  snow: false,
  highContrast: false
}

const setup = (params: any) => {
  (useSelector as jest.Mock).mockImplementation(() => ({
    ...defaultSelector,
    ...params
  }))
}
(useSelector as jest.Mock).mockImplementation(() => (defaultSelector))

jest.mock('actions/alert', () => ({
  clientClear: jest.fn(),
  clientError: jest.fn()
}))

jest.mock('actions/ui', () => ({
  closeModal: jest.fn(),
  toggleHighContrast: jest.fn()
}))

describe('components/TopContainer', () => {
  let wrapper: ReactWrapper
  const initialMockProps: TopContainerProps = {
    header: 'mockHeader',
    history: {}
  }

  beforeEach(() => {
    setup({})
    wrapper = mount(
      <TopContainer {...initialMockProps}>
        <div id='TEST_CHILD' />
      </TopContainer>
    )
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('Header')).toBeTruthy()
    expect(wrapper.exists('Banner')).toBeTruthy()
    expect(wrapper.exists('Alert')).toBeTruthy()
    expect(wrapper.exists('SessionMonitor')).toBeTruthy()
    expect(wrapper.exists('Footer')).toBeTruthy()
    expect(wrapper.exists('Modal')).toBeFalsy()
  })

  it('Compute the client error message', () => {
    (clientClear as jest.Mock).mockReset()
    setup({ clientErrorMessage: 'mockMessage|mockParams' })
    wrapper = mount(
      <TopContainer {...initialMockProps}>
        <div id='TEST_CHILD' />
      </TopContainer>
    )
    const clientAlert = wrapper.find('Alert[type="client"]')
    expect(clientAlert.render().text()).toEqual('mockMessage: mockParams')

    clientAlert.find('Icons').simulate('click')
    expect(clientClear).toHaveBeenCalled()
  })

  it('Toggles high contrast', () => {
    (toggleHighContrast as jest.Mock).mockReset()
    wrapper.find('Banner #c-banner__highcontrast-link-id').hostNodes().simulate('click')
    expect(toggleHighContrast).toHaveBeenCalledWith()
  })

  it('Opens and closes modal', () => {
    expect(wrapper.exists('Modal')).toBeFalsy()
    const mockModal: ModalContent = {
      modalTitle: 'mockTitle',
      modalText: 'mockText',
      modalButtons: [{
        text: 'ok'
      }]
    }
    setup({ modal: mockModal })
    wrapper = mount(
      <TopContainer {...initialMockProps}>
        <div id='TEST_CHILD' />
      </TopContainer>
    )

    expect(wrapper.exists('Modal')).toBeTruthy()
    const modal = wrapper.find('Modal').first()
    modal.find('button').hostNodes().last().simulate('click')
    expect(closeModal).toHaveBeenCalled()
  })
})
