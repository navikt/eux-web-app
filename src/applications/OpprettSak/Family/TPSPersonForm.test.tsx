import * as types from 'constants/actionTypes'
import { familierelasjoner } from 'eessi-kodeverk/lib/familierelasjoner'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import samplePerson from 'resources/tests/samplePerson'
import TPSPersonForm, { TPSPersonFormProps } from './TPSPersonForm'

describe('components/Family/TPSPersonForm', () => {
  let wrapper: ReactWrapper
  const initialMockProps: TPSPersonFormProps = {
    alertStatus: 'OK',
    alertMessage: 'Message',
    alertType: types.SAK_PERSON_RELATERT_GET_FAILURE,
    alertTypesWatched: [],
    existingFamilyRelationships: [],
    onAlertClose: jest.fn(),
    onRelationReset: jest.fn(),
    onSearchFnr: jest.fn(),
    onTPSPersonAddedFailure: jest.fn(),
    onTPSPersonAddedSuccess: jest.fn(),
    person: samplePerson,
    personRelatert: undefined,
    rolleList: familierelasjoner
  }

  beforeEach(() => {
    wrapper = mount(<TPSPersonForm {...initialMockProps} />)
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
