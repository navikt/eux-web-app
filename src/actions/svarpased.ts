import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { realCall, ActionWithPayload, ThunkResult } from 'js-fetch-api'
import { Action, ActionCreator } from 'redux'
import { FamilieRelasjon } from 'declarations/types'

const sprintf = require('sprintf-js').sprintf

export const getSaksnummer: ActionCreator<ThunkResult<ActionWithPayload>> = (
  saksnummer: string
): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SVARPASED_SAKSNUMMER_URL, { saksnummer: saksnummer }),
    type: {
      request: types.SVARPASED_SAKSNUMMER_GET_REQUEST,
      success: types.SVARPASED_SAKSNUMMER_GET_SUCCESS,
      failure: types.SVARPASED_SAKSNUMMER_GET_FAILURE
    }
  })
}

export const getSed: ActionCreator<ThunkResult<ActionWithPayload>> = (
  sed: string
): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SVARPASED_SED_URL, {
      sed: sed
    }),
    type: {
      request: types.SVARPASED_SED_GET_REQUEST,
      success: types.SVARPASED_SED_GET_SUCCESS,
      failure: types.SVARPASED_SED_GET_FAILURE
    }
  })
}

export const getPerson: ActionCreator<ThunkResult<ActionWithPayload>> = (
  fnr: string
): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SVARPASED_PERSON_URL, { fnr: fnr }),
    cascadeFailureError: true,
    type: {
      request: types.SVARPASED_PERSON_GET_REQUEST,
      success: types.SVARPASED_PERSON_GET_SUCCESS,
      failure: types.SVARPASED_PERSON_GET_FAILURE
    }
  })
}

export const addFamilierelasjoner: ActionCreator<ActionWithPayload> = (
  payload: FamilieRelasjon
): ActionWithPayload => ({
  type: types.SVARPASED_FAMILIERELASJONER_ADD,
  payload: payload
})

export const removeFamilierelasjoner: ActionCreator<ActionWithPayload> = (
  payload: FamilieRelasjon
): ActionWithPayload => ({
  type: types.SVARPASED_FAMILIERELASJONER_REMOVE,
  payload: payload
})

export const resetPersonRelatert: ActionCreator<Action> = (): Action => ({
  type: types.SVARPASED_PERSON_RELATERT_RESET
})
