import { render } from '@testing-library/react'
import React from 'react'
import Forside from './Forside'

jest.mock('components/TopContainer/TopContainer', () => ({ children }: any) => (<div className='mock-topContainer'>{children}</div>))
jest.mock('react-router-dom', () => ({
  Link: () => (<div className='mock-link' />)
}))

describe('pages/Forside', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = render(<Forside />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('HTML structure', () => {
    expect(wrapper.exists('.p-forside')).toBeTruthy()
  })
})
