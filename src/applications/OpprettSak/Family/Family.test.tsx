import { familierelasjoner } from '@navikt/eessi-kodeverk/lib/familierelasjoner'
import { render } from '@testing-library/react'
import React from 'react'
import samplePerson from 'resources/tests/samplePerson'
import Family, { FamilyProps } from './Family'

describe('components/Family/Family', () => {
  let wrapper: any

  const initialMockProps: FamilyProps = {
    alertVariant: undefined,
    alertMessage: undefined,
    alertType: undefined,
    familierelasjonKodeverk: familierelasjoner,
    onAbroadPersonAddedFailure: jest.fn(),
    onAbroadPersonAddedSuccess: jest.fn(),
    onRelationAdded: jest.fn(),
    onRelationRemoved: jest.fn(),
    onRelationReset: jest.fn(),
    onSearchFnr: jest.fn(),
    onTPSPersonAddedFailure: jest.fn(),
    onTPSPersonAddedSuccess: jest.fn(),
    personRelatert: undefined,
    searchingRelatertPerson: false,
    person: samplePerson,
    valgteFamilieRelasjoner: undefined,
    abroadPersonFormAlertTypesWatched: [],
    TPSPersonFormAlertTypesWatched: [],
    namespace: undefined,
    validation: {}
  }

  beforeEach(() => {
    wrapper = render(<Family {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('HTML structure', () => {
    expect(wrapper.exists('.c-family')).toBeTruthy()
  })
})
