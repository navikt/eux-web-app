import Select from 'components/Select/Select'
import { mount, ReactWrapper } from 'enzyme'
import ReactSelect from 'react-select'
import React from 'react'

describe('components/Select/Select', () => {
  let wrapper: ReactWrapper
  const initialMockProps = {
    highContrast: false,
    feil: undefined
  }

  beforeEach(() => {
    wrapper = mount(<Select {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find(ReactSelect)).toBeTruthy()
  })
})
