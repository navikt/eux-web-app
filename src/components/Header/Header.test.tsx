import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import Header, { HeaderProps, HeaderSelector } from './Header'

jest.mock('react-router-dom', () => ({
  Link: () => (<div className='mock-link' />)
}))

describe('components/Header/Header', () => {
  let wrapper: ReactWrapper
  const initialMockProps: HeaderProps = {
    className: 'mock-classname'
  }

  const defaultSelector: HeaderSelector = {
    saksbehandler: undefined
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<Header {...initialMockProps}/>)
  })

  afterEach(() => {
    wrapper.unmount()
  })


  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('HTML structure', () => {
    expect(wrapper.exists('.c-header')).toBeTruthy()
  })
})
