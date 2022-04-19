import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockPerson from 'mocks/person'
import { Action, ActionCreator } from 'redux'
const sprintf = require('sprintf-js').sprintf

export const cleanPersons: ActionCreator<Action> = () => ({
  type: types.PERSON_CLEAN_DATA
})

export const resetPerson: ActionCreator<Action> = () => ({
  type: types.PERSON_SEARCH_RESET
})

export const resetPersonRelated: ActionCreator<Action> = () => ({
  type: types.PERSON_RELATERT_SEARCH_RESET
})

export const searchPerson = (
  fnr: string
): ActionWithPayload => {
  return call({
    url: sprintf(urls.API_PERSONER_URL, { fnr: fnr }),
    expectedPayload: mockPerson,
    cascadeFailureError: true,
    type: {
      request: types.PERSON_SEARCH_REQUEST,
      success: types.PERSON_SEARCH_SUCCESS,
      failure: types.PERSON_SEARCH_FAILURE
    }
  })
}

export const searchPersonRelated = (
  fnr: string
): ActionWithPayload => {
  return call({
    url: sprintf(urls.API_PERSONER_URL, { fnr: fnr }),
    expectedPayload: mockPerson,
    cascadeFailureError: true,
    context: {
      fnr: fnr
    },
    type: {
      request: types.PERSON_RELATERT_SEARCH_REQUEST,
      success: types.PERSON_RELATERT_SEARCH_SUCCESS,
      failure: types.PERSON_RELATERT_SEARCH_FAILURE
    }
  })
}
