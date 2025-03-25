import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockPersonInfo from 'mocks/personInfo'
import mockPersonMedFamilie from 'mocks/personmedfamilie'
import { Action, ActionCreator } from 'redux'
const sprintf = require('sprintf-js').sprintf

export const personReset: ActionCreator<Action> = () => ({
  type: types.PERSON_RESET
})

export const resetPerson: ActionCreator<Action> = () => ({
  type: types.PERSON_SEARCH_RESET
})

export const searchPerson = (
  fnr: string
): ActionWithPayload => {
  return call({
    url: sprintf(urls.API_PDL_PERSON_URL, { fnr }),
    expectedPayload: mockPersonInfo,
    cascadeFailureError: true,
    type: {
      request: types.PERSON_SEARCH_REQUEST,
      success: types.PERSON_SEARCH_SUCCESS,
      failure: types.PERSON_SEARCH_FAILURE
    }
  })
}

export const searchPersonMedFamilie = (
  fnr: string
): ActionWithPayload => {
  return call({
    url: sprintf(urls.API_PERSON_MED_FAMILIE_URL, { fnr }),
    expectedPayload: mockPersonMedFamilie,
    cascadeFailureError: true,
    type: {
      request: types.PERSON_MED_FAMILIE_SEARCH_REQUEST,
      success: types.PERSON_MED_FAMILIE_SEARCH_SUCCESS,
      failure: types.PERSON_MED_FAMILIE_SEARCH_FAILURE
    }
  })
}

export const searchPersonRelatert = (
    fnr: string
  ): ActionWithPayload => {
    return call({
      url: sprintf(urls.API_PDL_PERSON_URL, { fnr }),
      expectedPayload: mockPersonInfo,
      cascadeFailureError: true,
      type: {
        request: types.PERSON_RELATERT_SEARCH_REQUEST,
        success: types.PERSON_RELATERT_SEARCH_SUCCESS,
        failure: types.PERSON_RELATERT_SEARCH_FAILURE
      }
    })
}

export const personRelatertReset: ActionCreator<Action> = (): Action => ({
  type: types.PERSON_RELATERT_RESET
})



