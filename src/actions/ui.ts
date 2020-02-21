import * as types from 'constants/actionTypes'
import { Action } from 'redux'

export const toggleHighContrast = (): Action => ({
  type: types.UI_HIGHCONTRAST_TOGGLE
})
