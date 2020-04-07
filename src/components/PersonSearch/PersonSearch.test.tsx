import * as types from 'constants/actionTypes'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import samplePerson from 'resources/tests/samplePerson'
import { stageSelector } from 'setupTests'
import PersonSearch, { PersonSearchProps, PersonSearchSelector } from './PersonSearch'

describe('components/PersonSearch/PersonSearch', () => {
  let wrapper: ReactWrapper
  const initialMockProps: PersonSearchProps = {
    className: 'mock-className',
    onFnrChange: jest.fn(),
    onPersonFound: jest.fn(),
    resetAllValidation: jest.fn(),
    validation: {}
  }

  const defaultSelector: PersonSearchSelector = {
    alertStatus: 'ERROR',
    alertMessage: 'message',
    alertType: types.SAK_PERSON_GET_FAILURE,
    fnr: '12345678901',
    gettingPerson: false,
    person: samplePerson
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<PersonSearch {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('HTML structure', () => {
    expect(wrapper.exists('.personsok')).toBeTruthy()
  })
})
