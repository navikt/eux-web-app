import { familierelasjoner } from '@navikt/eessi-kodeverk/lib/familierelasjoner'
import { render } from '@testing-library/react'
import React from 'react'
import samplePerson from 'resources/tests/samplePerson'
import PersonCard, { PersonCardProps } from './PersonCard'

describe('components/PersonCard/PersonCard', () => {
  let wrapper: any
  const initialMockProps: PersonCardProps = {
    className: 'mock-classname',
    familierelasjonKodeverk: familierelasjoner,
    onAddClick: jest.fn(),
    onRemoveClick: jest.fn(),
    person: samplePerson,
    rolleList: familierelasjoner
  }

  beforeEach(() => {
    wrapper = render(<PersonCard {...initialMockProps} />)
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
