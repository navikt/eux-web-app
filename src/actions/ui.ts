import * as types from 'constants/actionTypes'
import {Action} from 'redux'
import {ActionWithPayload} from "@navikt/fetch";

export const toggleHighContrast = (): Action => ({
  type: types.UI_HIGHCONTRAST_TOGGLE
})

export const setTextAreaDirty = (isDirty: boolean): ActionWithPayload<any> => ({
  type: types.UI_SET_TEXTAREA_DIRTY,
  payload: { isDirty }
})

export const setTextFieldDirty = (isDirty: boolean): ActionWithPayload<any> => ({
  type: types.UI_SET_TEXTAREA_DIRTY,
  payload: { isDirty }
})
