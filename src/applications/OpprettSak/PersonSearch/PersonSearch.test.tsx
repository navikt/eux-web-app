import * as types from 'constants/actionTypes'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import samplePerson from 'resources/tests/samplePerson'
import PersonSearch, { PersonSearchProps } from './PersonSearch'

describe('components/PersonSearch/PersonSearch', () => {
  let wrapper: ReactWrapper
  const initialMockProps: PersonSearchProps = {
    alertMessage: 'message',
    alertType: types.SAK_PERSON_GET_FAILURE,
    alertTypesWatched: [types.SAK_PERSON_GET_FAILURE],
    className: 'mock-className',
    id: 'id',
    feil: undefined,
    initialFnr: '12345678901',
    gettingPerson: false,
    onFnrChange: jest.fn(),
    onPersonFound: jest.fn(),
    onPersonRemoved: jest.fn(),
    onSearchPerformed: jest.fn(),
    person: samplePerson,
    resetAllValidation: jest.fn()
  }

  beforeEach(() => {
    wrapper = mount(<PersonSearch {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: HTML structure', () => {
    expect(wrapper.exists('.personsok')).toBeTruthy()
  })
})
