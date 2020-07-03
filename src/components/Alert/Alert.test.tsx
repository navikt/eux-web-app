import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { Alert, AlertProps } from './Alert'

describe('components/Alert/Alert', () => {
  let wrapper: ReactWrapper
  const initialMockProps: AlertProps = {
    status: 'OK',
    message: 'mockErrorMessage',
    error: {},
    onClose: jest.fn()
  }

  it('Renders', () => {
    wrapper = mount(<Alert {...initialMockProps} type='server' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure as server', () => {
    wrapper = mount(<Alert {...initialMockProps} type='server' />)
    expect(wrapper.exists('.c-alert__type-server')).toBeTruthy()
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage')
  })

  it('Has proper HTML structure as client', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' />)
    expect(wrapper.exists('.c-alert__type-client')).toBeTruthy()
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage')
  })

  it('Has proper HTML structure with error message', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' error={{ message: 'mockError' }} />)
    expect(wrapper.exists('.c-alert__type-client')).toBeTruthy()
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage: mockError')
  })

  it('Has proper HTML structure as client in OK type', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' />)
    expect(wrapper.render().hasClass('alertstripe--suksess')).toBeTruthy()
  })

  it('Has proper HTML structure as client in ERROR type', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' status='WARNING' />)
    expect(wrapper.render().hasClass('alertstripe--advarsel')).toBeTruthy()
  })

  it('Has proper HTML structure as client in ERROR type', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' status='ERROR' />)
    expect(wrapper.render().hasClass('alertstripe--feil')).toBeTruthy()
  })

  it('Close button clears alert', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' status='ERROR' />)
    wrapper.find('.closeIcon').hostNodes().simulate('click')
    expect(initialMockProps.onClose).toHaveBeenCalled()
  })

  it('Pretty prints a error message', () => {
    const error = {
      status: '500',
      message: 'message',
      error: 'error',
      uuid: 'uuid'
    }
    wrapper = mount(<Alert {...initialMockProps} type='server' error={error} />)
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage: message - error - uuid')
  })

  it('Pretty prints a string error', () => {
    const error = 'error'
    wrapper = mount(<Alert {...initialMockProps} type='client' error={error} />)
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage: error')
  })
})
