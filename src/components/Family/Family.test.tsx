
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import Family, { FamilySelector } from './Family'
import samplePerson from 'resources/tests/samplePerson'
import { familierelasjoner } from 'eessi-kodeverk/lib/familierelasjoner'

describe('components/Family/Family', () => {
  let wrapper: ReactWrapper

  const defaultSelector: FamilySelector = {
    familierelasjonKodeverk: familierelasjoner,
    person: samplePerson,
    valgteFamilieRelasjoner: undefined
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<Family />)
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
