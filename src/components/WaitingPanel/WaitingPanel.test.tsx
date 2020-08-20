import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import WaitingPanel from './WaitingPanel'

describe('components/WaitingPanel', () => {
  let wrapper: ReactWrapper

  it('Renders', () => {
    wrapper = mount(<WaitingPanel message='' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    wrapper = mount(<WaitingPanel message='testmessage' />)
    expect(wrapper.exists('.c-waitingPanel')).toBeTruthy()
    expect(wrapper.find('.c-waitingPanel__message').hostNodes().text()).toEqual('testmessage')
  })
})
