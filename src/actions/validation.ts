import * as types from 'constants/actionTypes'
import { Validation } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'
import { Action, ActionCreator } from 'redux'

export const setAllValidation: ActionCreator<ActionWithPayload<Validation>> = (
  newValidation: Validation
): ActionWithPayload<Validation> => ({
  type: types.VALIDATION_ALL_SET,
  payload: newValidation
})

export const resetValidation: ActionCreator<ActionWithPayload> = (
  key?: string
): ActionWithPayload => ({
  type: types.VALIDATION_SET,
  payload: {
    key: key,
    value: undefined
  }
})

export const viewValidation: ActionCreator<Action> = (): Action => ({
  type: types.VALIDATION_VIEW
})

export const setResetValidationFunction: ActionCreator<ActionWithPayload> = (
resetValidation: (key?: string | undefined) => void
): ActionWithPayload => ({
  type: types.VALIDATION_RESETFUNCTION_SET,
  payload: resetValidation
})
