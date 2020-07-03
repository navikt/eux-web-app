export interface ModalButton {
  onClick?: () => void;
  disabled ?: boolean;
  main?: boolean;
  text: string;
}

export interface ModalContent {
  modalTitle?: string | null;
  modalContent ?: JSX.Element |string |null;
  modalText ?: string |null;
  modalButtons?: Array<ModalButton> |null;
  closeButton?: boolean | null;
}

export type AllowedLocaleString = 'en' | 'nb'
