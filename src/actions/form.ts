import * as types from 'constants/actionTypes'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'
import { ActionCreator } from 'redux'

export const set = (key: any, value: any) => ({
  type: types.FORM_VALUE_SET,
  payload: {
    key: key,
    value: value
  }
})

export const addArbeidsforhold:  ActionCreator<ActionWithPayload> = (payload: any): ActionWithPayload => ({
  type: types.FORM_ARBEIDSFORHOLD_ADD,
  payload: payload
})

export const removeArbeidsforhold:  ActionCreator<ActionWithPayload> = (payload: any): ActionWithPayload => ({
  type: types.FORM_ARBEIDSFORHOLD_REMOVE,
  payload: payload
})

export const addFamilierelasjoner:  ActionCreator<ActionWithPayload> = (payload: any): ActionWithPayload => ({
  type: types.FORM_FAMILIERELASJONER_ADD,
  payload: payload
})

export const removeFamilierelasjoner:  ActionCreator<ActionWithPayload> = (payload: any): ActionWithPayload => ({
  type: types.FORM_FAMILIERELASJONER_REMOVE,
  payload: payload
})
