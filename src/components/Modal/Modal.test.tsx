import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import Modal, { ModalProps } from './Modal'

describe('components/Modal', () => {
  let wrapper: ReactWrapper
  const initialMockProps: ModalProps = {
    highContrast: false,
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

  it('Render: match snapshot', () => {
    wrapper = mount(<Modal {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    wrapper = mount(<Modal {...initialMockProps} />)
    expect(wrapper.find('[data-test-id=\'c-modal__title-id\']').hostNodes().render().text()).toEqual(initialMockProps.modal!.modalTitle)
    expect(wrapper.find('[data-test-id=\'c-modal__text-id\']').hostNodes().render().text()).toEqual(initialMockProps.modal!.modalText)
    expect(wrapper.find('[data-test-id=\'c-modal__button-id-0\']').hostNodes().render().text()).toEqual(initialMockProps.modal!.modalButtons![0].text)
    expect(wrapper.find('[data-test-id=\'c-modal__button-id-1\']').hostNodes().render().text()).toEqual(initialMockProps.modal!.modalButtons![1].text)
  })

  it('Handling: buttons are active', () => {
    wrapper = mount(<Modal {...initialMockProps} />);
    (initialMockProps.modal!.modalButtons![0].onClick as jest.Mock).mockReset();
    (initialMockProps.modal!.modalButtons![1].onClick as jest.Mock).mockReset()
    wrapper.find('[data-test-id=\'c-modal__button-id-0\']').hostNodes().simulate('click')
    expect(initialMockProps.modal!.modalButtons![0].onClick).toHaveBeenCalled()

    wrapper.find('[data-test-id=\'c-modal__button-id-1\']').hostNodes().simulate('click')
    expect(initialMockProps.modal!.modalButtons![1].onClick).toHaveBeenCalled()
  })

  it('Handling: close buttons clicked', () => {
    (initialMockProps.onModalClose as jest.Mock).mockReset()
    wrapper = mount(<Modal {...initialMockProps} />)
    wrapper.find('[data-test-id=\'c-modal__close-button-id\']').hostNodes().simulate('click')
    expect(initialMockProps.onModalClose).toHaveBeenCalled()
  })
})
