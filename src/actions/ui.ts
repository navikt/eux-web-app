import * as types from 'constants/actionTypes'
import {ActionWithPayload} from "@navikt/fetch";

export const setTextAreaDirty = (isDirty: boolean): ActionWithPayload<any> => ({
  type: types.UI_SET_TEXTAREA_DIRTY,
  payload: { isDirty }
})

export const setTextFieldDirty = (isDirty: boolean): ActionWithPayload<any> => ({
  type: types.UI_SET_TEXTAREA_DIRTY,
  payload: { isDirty }
})
