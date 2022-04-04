import { render } from '@testing-library/react'
import React from 'react'
import UkjentSide from './UkjentSide'
jest.mock('components/TopContainer/TopContainer', () => ({ children }: any) => (<div className='mock-topContainer'>{children}</div>))

describe('pages/OpprettSak/OpprettSak', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = render(<UkjentSide />)
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
