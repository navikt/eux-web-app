import { AlertVariant } from 'declarations/components'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import BannerAlert, { BannerAlertProps } from './BannerAlert'

describe('components/BannerAlert/BannerAlert', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BannerAlertProps = {
    variant: 'success',
    message: 'mockErrorMessage',
    error: undefined,
    onClose: jest.fn()
  }

  it('Render: match snapshot', () => {
    wrapper = mount(<BannerAlert {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    wrapper = mount(<BannerAlert {...initialMockProps} />)
    expect(wrapper.exists('.type-server')).toBeTruthy()
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage')
  })

  it('Render: has proper HTML structure as client', () => {
    wrapper = mount(<BannerAlert {...initialMockProps} />)
    expect(wrapper.exists('.type-client')).toBeTruthy()
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage')
  })

  it('Render: has proper HTML structure with error message', () => {
    wrapper = mount(<BannerAlert {...initialMockProps} error='mockError' />)
    expect(wrapper.exists('.type-client')).toBeTruthy()
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage: mockError')
  })

  it('Render: has proper HTML structure as client in OK type', () => {
    wrapper = mount(<BannerAlert {...initialMockProps} />)
    expect(wrapper.render().hasClass('alertstripe--suksess')).toBeTruthy()
  })

  it('Render: has proper HTML structure as client in WARNING type', () => {
    wrapper = mount(<BannerAlert {...initialMockProps} variant='warning' />)
    expect(wrapper.render().hasClass('alertstripe--advarsel')).toBeTruthy()
  })

  it('Render: has proper HTML structure as client in ERROR type', () => {
    wrapper = mount(<BannerAlert {...initialMockProps} variant='error' />)
    expect(wrapper.render().hasClass('alertstripe--error')).toBeTruthy()
  })

  it('Render: Pretty prints a error message', () => {
    const error = {
      status: 'error' as AlertVariant,
      message: 'message',
      error: 'error',
      uuid: 'uuid'
    }
    wrapper = mount(<BannerAlert {...initialMockProps} error={error} />)
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage: message - error - uuid')
  })

  it('Render: Pretty prints a string error', () => {
    const error = 'error'
    wrapper = mount(<BannerAlert {...initialMockProps} error={error} />)
    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockErrorMessage: error')
  })

  it('Handling: close button clears alert', () => {
    (initialMockProps.onClose as jest.Mock).mockReset()
    wrapper = mount(<BannerAlert {...initialMockProps} variant='error' />)
    wrapper.find('[data-test-id=\'alert__close-icon\']').hostNodes().simulate('click')
    expect(initialMockProps.onClose).toHaveBeenCalled()
  })
})
