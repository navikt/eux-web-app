import Select from 'components/Forms/Select'
import { render } from '@testing-library/react'
import ReactSelect from 'react-select'
import React from 'react'

describe('components/Forms/Select', () => {
  let wrapper: any
  const initialMockProps = {
    error: undefined,
    id: 'test',
    onChange: () => {}
  }

  beforeEach(() => {
    wrapper = render(<Select {...initialMockProps} />)
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
