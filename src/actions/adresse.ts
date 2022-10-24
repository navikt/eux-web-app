import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { Adresse } from 'declarations/sed'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockAdresse from 'mocks/adresse/adresse'
import { Action, ActionCreator } from 'redux'
const sprintf = require('sprintf-js').sprintf

export const resetAdresse: ActionCreator<Action> = (): Action => ({
  type: types.ADRESSE_SEARCH_RESET
})

export const searchAdresse = (
  fnr: string
): ActionWithPayload<Array<Adresse>> => {
  return call({
    url: sprintf(urls.API_ADRESSE_URL, { fnr }),
    expectedPayload: mockAdresse,
    cascadeFailureError: true,
    type: {
      request: types.ADRESSE_SEARCH_REQUEST,
      success: types.ADRESSE_SEARCH_SUCCESS,
      failure: types.ADRESSE_SEARCH_FAILURE
    }
  })
}
