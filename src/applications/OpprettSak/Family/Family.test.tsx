import { familierelasjoner } from 'eessi-kodeverk/lib/familierelasjoner'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import samplePerson from 'resources/tests/samplePerson'
import Family, { FamilyProps } from './Family'

describe('components/Family/Family', () => {
  let wrapper: ReactWrapper

  const initialMockProps: FamilyProps = {
    alertStatus: undefined,
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
    person: samplePerson,
    valgteFamilieRelasjoner: undefined,
    abroadPersonFormAlertTypesWatched: [],
    TPSPersonFormAlertTypesWatched: []
  }

  beforeEach(() => {
    wrapper = mount(<Family {...initialMockProps} />)
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
