export interface ModalButton {
  onClick?: () => void
  disabled ?: boolean
  main?: boolean
  flat?: boolean
  text: string
  hide ?: boolean
}

export interface ModalContent {
  modalTitle?: string | null
  modalContent ?: JSX.Element | string |null
  modalText ?: JSX.Element | string | null
  modalButtons?: Array<ModalButton> |null
  closeButton?: boolean | null
}

export type AllowedLocaleString = 'en' | 'nb'

export interface AlertError {
  status?: AlertVariant
  message?: JSX.Element | string
  error?: string | undefined
  uuid ?: string | undefined
}

export type AlertVariant = 'error' | 'warning' | 'info' | 'success'
