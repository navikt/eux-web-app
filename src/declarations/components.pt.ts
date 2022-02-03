import { AlertVariant } from 'declarations/components'
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
  modalText: PT.oneOfType([PT.element, PT.string]),
  modalButtons: PT.arrayOf(ModalButtonPropType.isRequired),
  closeButton: PT.bool
})

export const AlertErrorPropType = PT.shape({
  variant: PT.oneOf<AlertVariant>(['info', 'success', 'error', 'warning']).isRequired,
  message: PT.string.isRequired,
  error: PT.string.isRequired,
  uuid: PT.string.isRequired
})
