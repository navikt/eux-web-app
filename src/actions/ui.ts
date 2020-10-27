import * as types from '../constants/actionTypes'
import { ModalContent } from '../declarations/components'
import { ActionWithPayload } from 'js-fetch-api'
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
