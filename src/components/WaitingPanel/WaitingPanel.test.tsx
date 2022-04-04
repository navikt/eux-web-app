import { render } from '@testing-library/react'
import React from 'react'
import WaitingPanel from './WaitingPanel'

describe('components/WaitingPanel', () => {
  let wrapper: any

  it('Renders', () => {
    wrapper = render(<WaitingPanel message='' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    wrapper = render(<WaitingPanel message='testmessage' />)
    expect(wrapper.exists('.c-waitingPanel')).toBeTruthy()
    expect(wrapper.find('.c-waitingPanel__message').hostNodes().text()).toEqual('testmessage')
  })
})
