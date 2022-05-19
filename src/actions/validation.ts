import * as types from 'constants/actionTypes'
import { Validation } from 'declarations/types'
import { ActionWithPayload } from '@navikt/fetch'
import { ActionCreator } from 'redux'

export const resetValidation = (
  key?: string
) => ({
  type: types.VALIDATION_RESET,
  payload: key ? { key } : {}
})

export const setValidation: ActionCreator<ActionWithPayload<Validation>> = (
  newValidation: Validation
): ActionWithPayload<Validation> => ({
  type: types.VALIDATION_SET,
  payload: newValidation
})
