import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockPerson from 'mocks/person'
import { Action, ActionCreator } from 'redux'
const sprintf = require('sprintf-js').sprintf

export const searchPerson: ActionCreator<ThunkResult<ActionWithPayload>> = (
  fnr: string
): ThunkResult<ActionWithPayload> => {
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

export const resetPerson: ActionCreator<Action> = () => ({
  type: types.PERSON_SEARCH_RESET
})

export const searchPersonRelated: ActionCreator<ThunkResult<ActionWithPayload>> = (
  fnr: string
): ThunkResult<ActionWithPayload> => {
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
