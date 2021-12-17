import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import OpprettSak, { OpprettSakSelector } from './OpprettSak'

jest.mock('react-router-dom', () => ({
  Link: () => (<div className='mock-link' />)
}))

describe('pages/OpprettSak/OpprettSak', () => {
  let wrapper: ReactWrapper

  const defaultSelector: OpprettSakSelector = {
    alertMessage: undefined,
    alertVariant: undefined,
    alertType: undefined,

    enheter: undefined,
    serverInfo: undefined,
    buctyper: undefined,
    familierelasjonKodeverk: undefined,
    kodemaps: undefined,
    landkoder: undefined,
    sedtyper: undefined,
    sektor: undefined,
    tema: undefined,

    sendingSak: false,
    searchingPerson: false,
    gettingFagsaker: false,
    gettingArbeidsperioder: false,

    arbeidsperioder: undefined,
    valgteArbeidsgivere: [],
    valgtBucType: undefined,
    valgteFamilieRelasjoner: [],
    fagsaker: undefined,
    valgtFnr: undefined,
    valgtInstitusjon: undefined,
    institusjoner: undefined,
    valgtLandkode: undefined,
    opprettetSak: undefined,
    person: undefined,
    personRelatert: undefined,
    valgtSaksId: undefined,
    valgtSedType: undefined,
    valgtSektor: undefined,
    valgtTema: undefined,
    valgtUnit: undefined
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<OpprettSak />)
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
