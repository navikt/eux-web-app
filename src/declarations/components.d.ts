export interface ModalButton {
  onClick?: () => void
  disabled ?: boolean
  main?: boolean
  flat?: boolean
  text: string
}

export interface ModalContent {
  modalTitle?: string | null
  modalContent ?: JSX.Element |string |null
  modalText ?: string |null
  modalButtons?: Array<ModalButton> |null
  closeButton?: boolean | null
}

export type AllowedLocaleString = 'en' | 'nb'

export type AlertStatus = 'OK' | 'ERROR' | 'WARNING'

export interface AlertError {
  status?: AlertStatus
  message?: JSX.Element | string
  error?: string | undefined
  uuid ?: string | undefined
}

export type AlertVariant = 'error' | 'warning' | 'info' | 'success'
