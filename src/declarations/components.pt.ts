import PT from 'prop-types'

export const ModalButtonPropType = PT.shape({
  onClick: PT.func,
  disabled: PT.bool,
  main: PT.bool,
  text: PT.string.isRequired
})

export const ModalContentPropType = PT.shape({
  modalTitle: PT.string,
  modalContent: PT.oneOfType([PT.element, PT.string]),
  modalText: PT.string,
  modalButtons: PT.arrayOf(ModalButtonPropType.isRequired),
  closeButton: PT.bool
})
