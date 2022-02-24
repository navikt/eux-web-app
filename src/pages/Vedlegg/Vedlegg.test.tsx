import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import Vedlegg, { VedleggSelector } from './Vedlegg'

jest.mock('react-router-dom', () => ({
  Link: () => (<div className='mock-link' />)
}))

describe('pages/Vedlegg', () => {
  let wrapper: ReactWrapper

  const defaultSelector: VedleggSelector = {
    alertType: undefined,
    alertMessage: undefined,
    vedleggResponse: undefined,
    rinasaksnummer: undefined,
    journalpostID: undefined,
    rinadokumentID: undefined,
    dokumentID: undefined,
    sensitivt: true,
    sendingVedlegg: false,
    validation: {}
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<Vedlegg />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('HTML structure', () => {
    expect(wrapper.exists('.vedlegg')).toBeTruthy()
  })
})
