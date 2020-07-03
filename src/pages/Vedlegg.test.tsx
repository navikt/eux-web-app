import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import Vedlegg, { VedleggProps, VedleggSelector } from './Vedlegg'

jest.mock('react-router-dom', () => ({
  Link: () => (<div className='mock-link' />)
}))

describe('pages/Vedlegg', () => {
  let wrapper: ReactWrapper
  const initialMockProps: VedleggProps = {
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

  const defaultSelector: VedleggSelector = {
    vedlegg: undefined,
    rinasaksnummer: undefined,
    journalpostID: undefined,
    rinadokumentID: undefined,
    dokumentID: undefined,
    sendingVedlegg: false
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<Vedlegg {...initialMockProps} />)
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
