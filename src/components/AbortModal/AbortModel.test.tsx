
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import AbortModal, { AbortModalProps } from './AbortModal'

describe('components/AbortModal/AbortModal', () => {
  let wrapper: ReactWrapper
  const initialMockProps: AbortModalProps = {
    closeModal: jest.fn(),
    onAbort: jest.fn(),
    isOpen: true
  }

  it('Renders', () => {
    wrapper = mount(<AbortModal {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('HTML structure', () => {
    wrapper = mount(<AbortModal {...initialMockProps} />)
    expect(wrapper.exists('div.modal__innhold')).toBeTruthy()
  })
})
