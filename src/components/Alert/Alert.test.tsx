import { AlertStatus } from 'declarations/components'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import Alert, { AlertProps } from './Alert'

describe('components/Alert/Alert', () => {
  let wrapper: ReactWrapper
  const initialMockProps: AlertProps = {
    status: 'OK',
    message: 'mockErrorMessage',
    error: undefined,
    onClose: jest.fn()
  }

  it('Render: match snapshot', () => {
    wrapper = mount(<Alert {...initialMockProps} type='server' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure as server', () => {
    wrapper = mount(<Alert {...initialMockProps} type='server' />)
    expect(wrapper.exists('.type-server')).toBeTruthy()
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage')
  })

  it('Render: has proper HTML structure as client', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' />)
    expect(wrapper.exists('.type-client')).toBeTruthy()
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage')
  })

  it('Render: has proper HTML structure with error message', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' error='mockError' />)
    expect(wrapper.exists('.type-client')).toBeTruthy()
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage: mockError')
  })

  it('Render: has proper HTML structure as client in OK type', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' />)
    expect(wrapper.render().hasClass('alertstripe--suksess')).toBeTruthy()
  })

  it('Render: has proper HTML structure as client in WARNING type', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' status='WARNING' />)
    expect(wrapper.render().hasClass('alertstripe--advarsel')).toBeTruthy()
  })

  it('Render: has proper HTML structure as client in ERROR type', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' status='ERROR' />)
    expect(wrapper.render().hasClass('alertstripe--feil')).toBeTruthy()
  })

  it('Render: Pretty prints a error message', () => {
    const error = {
      status: 'ERROR' as AlertStatus,
      message: 'message',
      error: 'error',
      uuid: 'uuid'
    }
    wrapper = mount(<Alert {...initialMockProps} type='server' error={error} />)
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage: message - error - uuid')
  })

  it('Render: Pretty prints a string error', () => {
    const error = 'error'
    wrapper = mount(<Alert {...initialMockProps} type='client' error={error} />)
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage: error')
  })

  it('Handling: close button clears alert', () => {
    (initialMockProps.onClose as jest.Mock).mockReset()
    wrapper = mount(<Alert {...initialMockProps} type='client' status='ERROR' />)
    wrapper.find('[data-test-id=\'alert__close-icon\']').hostNodes().simulate('click')
    expect(initialMockProps.onClose).toHaveBeenCalled()
  })
})
