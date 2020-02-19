import { ModalContent } from 'eessi-pensjon-ui/dist/declarations/components'
import * as types from 'constants/actionTypes'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'
import { Action } from 'redux'

export const openModal = (modal: ModalContent): ActionWithPayload<ModalContent> => ({
  type: types.UI_MODAL_SET,
  payload: modal
})

export const closeModal = (): ActionWithPayload<undefined> => ({
  type: types.UI_MODAL_SET,
  payload: undefined
})

export const toggleHighContrast = (): Action => ({
  type: types.UI_HIGHCONTRAST_TOGGLE
})
