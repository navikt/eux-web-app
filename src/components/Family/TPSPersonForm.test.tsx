import * as types from 'constants/actionTypes'
import { familierelasjoner } from 'eessi-kodeverk/lib/familierelasjoner'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import samplePerson from 'resources/tests/samplePerson'
import { stageSelector } from 'setupTests'
import TPSPersonForm, { TPSPersonFormProps, TPSPersonFormSelector } from './TPSPersonForm'

describe('components/Family/TPSPersonForm', () => {
  let wrapper: ReactWrapper
  const initialMockProps: TPSPersonFormProps = {
    rolleList: familierelasjoner
  }

  const defaultSelector: TPSPersonFormSelector = {
    alertStatus: 'OK',
    alertMessage: 'Message',
    alertType: types.SAK_PERSON_RELATERT_GET_FAILURE,
    personRelatert: undefined,
    person: samplePerson
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<TPSPersonForm {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('HTML structure', () => {
    expect(wrapper.exists('.c-TPSPersonForm')).toBeTruthy()
  })
})
