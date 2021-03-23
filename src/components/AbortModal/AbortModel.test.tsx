import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import AbortModal, { AbortModalProps } from './AbortModal'

describe('components/AbortModal/AbortModal', () => {
  let wrapper: ReactWrapper
  const initialMockProps: AbortModalProps = {
    closeModal: jest.fn(),
    highContrast: false,
    isOpen: true,
    onAbort: jest.fn()
  }

  it('Render: match snapshot', () => {
    wrapper = mount(<AbortModal {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: HTML structure', () => {
    wrapper = mount(<AbortModal {...initialMockProps} />)
    expect(wrapper.exists('div.modal__innhold')).toBeTruthy()
  })
})
