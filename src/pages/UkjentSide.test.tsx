import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import UkjentSide, { UkjentSideProps } from './UkjentSide'
jest.mock('components/TopContainer/TopContainer', () => ({children}: any) => (<div className='mock-topContainer'>{children}</div>))

describe('pages/OpprettSak/OpprettSak', () => {
  let wrapper: ReactWrapper
  const initialMockProps: UkjentSideProps = {
    location: {
      host: '',
      hash: '',
      hostname: '',
      href: '',
      origin: '',
      pathname: '',
      port: '',
      protocol: '',
      search: ''
    } as Location
  }

  beforeEach(() => {
    wrapper = mount(<UkjentSide {...initialMockProps}/>)
  })

  afterEach(() => {
    wrapper.unmount()
  })


  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('HTML structure', () => {
    expect(wrapper.exists('.p-ukjentSide')).toBeTruthy()
  })
})
