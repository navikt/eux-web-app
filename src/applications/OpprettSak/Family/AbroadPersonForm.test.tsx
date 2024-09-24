import { render } from '@testing-library/react'
import React from 'react'
import { stageSelector } from 'setupTests'
import AbroadPersonForm, { AbroadPersonFormProps, AbroadPersonFormSelector } from './AbroadPersonForm'
import { kjoenn } from '@navikt/eessi-kodeverk/lib/kjoenn'
import { familierelasjoner } from '@navikt/eessi-kodeverk/lib/familierelasjoner'

jest.mock('react-router-dom', () => ({
  Link: () => (<div className='mock-link' />)
}))

describe('applications/OpprettSak/Family/AbroadPersonForm', () => {
  let wrapper: any
  const initialMockProps: AbroadPersonFormProps = {
    alertMessage: undefined,
    alertType: undefined,
    alertTypesWatched: [],
    existingFamilyRelationships: [],
    rolleList: familierelasjoner,
    onAbroadPersonAddedFailure: jest.fn(),
    onAbroadPersonAddedSuccess: jest.fn(),
    person: {}
  }

  const defaultSelector: AbroadPersonFormSelector = {
    kjoennList: kjoenn,
    cdmVersjon: "4.2"
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = render(<AbroadPersonForm {...initialMockProps} />)
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: HTML structure', () => {
    expect(wrapper.exists('.c-abroadPersonForm')).toBeTruthy()
  })
})
