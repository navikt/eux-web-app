import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import AbroadPersonForm, { AbroadPersonFormProps, AbroadPersonFormSelector } from './AbroadPersonForm'
import { kjoenn } from 'eessi-kodeverk/lib/kjoenn'
import { familierelasjoner } from 'eessi-kodeverk/lib/familierelasjoner'

jest.mock('react-router-dom', () => ({
  Link: () => (<div className='mock-link' />)
}))

describe('applications/OpprettSak/Family/AbroadPersonForm', () => {
  let wrapper: ReactWrapper
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
    kjoennList: kjoenn
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<AbroadPersonForm {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: HTML structure', () => {
    expect(wrapper.exists('.c-abroadPersonForm')).toBeTruthy()
  })
})
