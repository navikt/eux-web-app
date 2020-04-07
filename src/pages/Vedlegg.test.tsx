import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import Vedlegg, { VedleggProps, VedleggSelector } from './Vedlegg'

jest.mock('react-router-dom', () => ({
  Link: () => (<div className='mock-link' />)
}))
jest.mock('eessi-pensjon-ui', () => {
  const Ui = jest.requireActual('eessi-pensjon-ui').default
  return {
    ...Ui,
    Nav: {
      ...Ui.Nav,
      Hjelpetekst: ({ children }: {children: any}) => <div className='mock-hjelpetekst'>{children}</div>
    }
  }
})

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
