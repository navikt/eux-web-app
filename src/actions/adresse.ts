import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockAdresse from 'mocks/adresse/adresse'
import { Action, ActionCreator } from 'redux'
const sprintf = require('sprintf-js').sprintf

export const searchAdresse: ActionCreator<ThunkResult<ActionWithPayload>> = (
  fnr: string
): ThunkResult<ActionWithPayload> => {
  return call({
    url: sprintf(urls.API_ADRESSE_URL, { fnr: fnr }),
    expectedPayload: mockAdresse,
    cascadeFailureError: true,
    type: {
      request: types.ADRESSE_SEARCH_REQUEST,
      success: types.ADRESSE_SEARCH_SUCCESS,
      failure: types.ADRESSE_SEARCH_FAILURE
    }
  })
}

export const resetAdresse: ActionCreator<Action> = () => ({
  type: types.ADRESSE_SEARCH_RESET
})
