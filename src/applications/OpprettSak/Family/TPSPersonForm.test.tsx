import * as types from 'constants/actionTypes'
import { familierelasjoner } from '@navikt/eessi-kodeverk/lib/familierelasjoner'
import { render } from '@testing-library/react'
import React from 'react'
import samplePerson from 'resources/tests/samplePerson'
import TPSPersonForm, { TPSPersonFormProps } from './TPSPersonForm'

describe('components/Family/TPSPersonForm', () => {
  let wrapper: any
  const initialMockProps: TPSPersonFormProps = {
    alertMessage: 'Message',
    alertType: types.PERSON_RELATERT_SEARCH_FAILURE,
    alertTypesWatched: [],
    existingFamilyRelationships: [],
    onRelationReset: jest.fn(),
    onSearchFnr: jest.fn(),
    onTPSPersonAddedFailure: jest.fn(),
    onTPSPersonAddedSuccess: jest.fn(),
    person: samplePerson,
    searchingRelatertPerson: false,
    personRelatert: undefined,
    rolleList: familierelasjoner
  }

  beforeEach(() => {
    wrapper = render(<TPSPersonForm {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: HTML structure', () => {
    expect(wrapper.exists('.c-TPSPersonForm')).toBeTruthy()
  })
})
