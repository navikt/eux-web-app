import * as types from '../constants/actionTypes'
import { Arbeidsforholdet, FamilieRelasjon } from '../declarations/types'
import { ActionWithPayload } from 'js-fetch-api'
import { ActionCreator } from 'redux'

export const set = (key: string, value: string | undefined) => ({
  type: types.FORM_VALUE_SET,
  payload: {
    key: key,
    value: value
  }
})

export const addArbeidsforhold: ActionCreator<ActionWithPayload> = (payload: Arbeidsforholdet): ActionWithPayload => ({
  type: types.FORM_ARBEIDSFORHOLD_ADD,
  payload: payload
})

export const removeArbeidsforhold: ActionCreator<ActionWithPayload> = (payload: Arbeidsforholdet): ActionWithPayload => ({
  type: types.FORM_ARBEIDSFORHOLD_REMOVE,
  payload: payload
})

export const addFamilierelasjoner: ActionCreator<ActionWithPayload> = (payload: FamilieRelasjon): ActionWithPayload => ({
  type: types.FORM_FAMILIERELASJONER_ADD,
  payload: payload
})

export const removeFamilierelasjoner: ActionCreator<ActionWithPayload> = (payload: FamilieRelasjon): ActionWithPayload => ({
  type: types.FORM_FAMILIERELASJONER_REMOVE,
  payload: payload
})
