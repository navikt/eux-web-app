import { clientClear } from 'actions/alert'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import { TopContainer, TopContainerProps, TopContainerSelector } from './TopContainer'

jest.mock('react-router-dom', () => ({
  Link: () => (<div className='mock-link' />)
}))

const defaultSelector: TopContainerSelector = {
  serverErrorMessage: undefined,
  error: undefined,
  highContrast: false
}

jest.mock('actions/alert', () => ({
  clientClear: jest.fn(),
  clientError: jest.fn()
}))

jest.mock('actions/ui', () => ({
  closeModal: jest.fn()
}))

describe('components/TopContainer', () => {
  let wrapper: ReactWrapper
  const initialMockProps: TopContainerProps = {
    header: 'mockHeader'
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
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
    expect(wrapper.exists('Alert')).toBeTruthy()
    expect(wrapper.exists('main')).toBeTruthy()
  })

  it('Compute the client error message', () => {
    (clientClear as jest.Mock).mockReset()
    stageSelector(defaultSelector, { serverErrorMessage: 'mockMessage|mockParams' })
    wrapper = mount(
      <TopContainer {...initialMockProps}>
        <div id='TEST_CHILD' />
      </TopContainer>
    )
    const clientAlert = wrapper.find('Alert[type="server"]')
    expect(clientAlert.render().text()).toEqual('feil' + 'mockMessage|mockParams')

    clientAlert.find('Icons').simulate('click')
    expect(clientClear).toHaveBeenCalled()
  })
})
