import { render } from '@testing-library/react'
import React from 'react'
import { stageSelector } from 'setupTests'
import SEDNew, { SEDNewSelector } from './SEDNew'

jest.mock('react-router-dom', () => ({
  Link: () => (<div className='mock-link' />)
}))

describe('pages/SEDNew/SEDNew', () => {
  let wrapper: any

  const initialMockProps = {}
  const defaultSelector: SEDNewSelector = {
    alertMessage: undefined,
    alertVariant: undefined,
    alertType: undefined,

    enheter: undefined,
    serverInfo: undefined,
    buctyper: undefined,
    familierelasjonKodeverk: undefined,
    filloutinfo: undefined,
    kodemaps: undefined,
    landkoder: undefined,
    sedtyper: undefined,
    sektor: undefined,
    tema: undefined,

    sendingSak: false,
    searchingPerson: false,
    searchingRelatertPerson: false,
    gettingFagsaker: false,
    creatingFagsak: false,
    gettingArbeidsperioder: false,
    gettingInstitusjoner: false,

    arbeidsperioder: undefined,
    valgteArbeidsperioder: [],
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
    valgtUnit: undefined,

    saks: undefined,
    currentSak: undefined,

    validation: {},
    featureToggles: undefined
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = render(<SEDNew {...initialMockProps} />)
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
