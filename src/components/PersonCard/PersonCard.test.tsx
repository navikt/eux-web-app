import { familierelasjoner } from 'eessi-kodeverk/lib/familierelasjoner'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import samplePerson from 'resources/tests/samplePerson'
import PersonCard, { PersonCardProps } from './PersonCard'

describe('components/PersonCard/PersonCard', () => {
  let wrapper: ReactWrapper
  const initialMockProps: PersonCardProps = {
    className: 'mock-classname',
    familierelasjonKodeverk: familierelasjoner,
    onAddClick: jest.fn(),
    onRemoveClick: jest.fn(),
    person: samplePerson,
    rolleList: familierelasjoner
  }

  beforeEach(() => {
    wrapper = mount(<PersonCard {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('HTML structure', () => {
    expect(wrapper.exists('.c-personCard')).toBeTruthy()
  })
})
