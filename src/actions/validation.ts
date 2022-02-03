import * as types from 'constants/actionTypes'
import { Validation } from 'declarations/types'
import { ActionWithPayload } from '@navikt/fetch'
import { Action, ActionCreator } from 'redux'

export const resetAllValidation: ActionCreator<ActionWithPayload<{}>> = (
): ActionWithPayload<{}> => ({
  type: types.VALIDATION_SET,
  payload: {}
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

export const setAllValidation: ActionCreator<ActionWithPayload<Validation>> = (
  newValidation: Validation
): ActionWithPayload<Validation> => ({
  type: types.VALIDATION_ALL_SET,
  payload: newValidation
})

export const viewValidation: ActionCreator<Action> = (): Action => ({
  type: types.VALIDATION_VIEW
})
