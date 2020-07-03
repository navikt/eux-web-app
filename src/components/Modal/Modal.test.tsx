import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { Modal, ModalProps } from './Modal'

describe('components/Modal', () => {
  let wrapper: ReactWrapper
  const initialMockProps: ModalProps = {
    modal: {
      modalTitle: 'mockModalTitle',
      modalText: 'mockModalText',
      modalButtons: [{
        main: true,
        text: 'modalMainButtonText',
        onClick: jest.fn()
      }, {
        text: 'modalOtherButtonText',
        onClick: jest.fn()
      }]
    },
    onModalClose: jest.fn(),
    closeButton: true
  }

  it('Renders', () => {
    wrapper = mount(<Modal {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    wrapper = mount(<Modal {...initialMockProps} />)
    expect(wrapper.find('.c-modal__title').hostNodes().render().text()).toEqual(initialMockProps.modal!.modalTitle)
    expect(wrapper.find('.c-modal__text').hostNodes().render().text()).toEqual(initialMockProps.modal!.modalText)
    expect(wrapper.find('#c-modal__main-button-id').hostNodes().render().text()).toEqual(initialMockProps.modal!.modalButtons![0].text)
    expect(wrapper.find('#c-modal__other-button-id').hostNodes().render().text()).toEqual(initialMockProps.modal!.modalButtons![1].text)
  })

  it('Buttons are active', () => {
    wrapper = mount(<Modal {...initialMockProps} />);
    (initialMockProps.modal!.modalButtons![0].onClick as jest.Mock).mockReset();
    (initialMockProps.modal!.modalButtons![1].onClick as jest.Mock).mockReset()
    wrapper.find('#c-modal__main-button-id').hostNodes().simulate('click')
    expect(initialMockProps.modal!.modalButtons![0].onClick).toHaveBeenCalled()

    wrapper.find('#c-modal__other-button-id').hostNodes().simulate('click')
    expect(initialMockProps.modal!.modalButtons![1].onClick).toHaveBeenCalled()
  })

  it('close buttons clicked', () => {
    (initialMockProps.onModalClose as jest.Mock).mockReset()
    wrapper = mount(<Modal {...initialMockProps} />)
    wrapper.find('.c-modal__close-button').hostNodes().simulate('click')
    expect(initialMockProps.onModalClose).toHaveBeenCalled()
  })
})
