import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import OpprettSak, { OpprettSakProps, OpprettSakSelector } from './OpprettSak'

jest.mock('react-router-dom', () => ({
  Link: () => (<div className='mock-link' />)
}))

describe('pages/OpprettSak/OpprettSak', () => {
  let wrapper: ReactWrapper
  const initialMockProps: OpprettSakProps = {
    history: {}
  }

  const defaultSelector: OpprettSakSelector = {
    arbeidsforhold: undefined,
    buctyper: undefined,
    sedtyper: undefined,
    fagsaker: undefined,
    institusjoner: undefined,
    kodemaps: undefined,
    landkoder: undefined,
    opprettetSak: undefined,
    person: undefined,
    sektor: undefined,
    sendingSak: false,
    serverInfo: undefined,
    tema: undefined,
    valgteArbeidsforhold: undefined,
    valgtBucType: undefined,
    valgtFnr: undefined,
    valgteFamilieRelasjoner: undefined,
    valgtInstitusjon: undefined,
    valgtLandkode: undefined,
    valgtSedType: undefined,
    valgtSektor: undefined,
    valgtSaksId: undefined,
    valgtTema: undefined
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<OpprettSak {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('HTML structure', () => {
    expect(wrapper.exists('.opprettsak')).toBeTruthy()
  })
})
