import { ActionWithPayload, call } from '@navikt/fetch'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { F001FilteredResult } from 'declarations/types'
import mockFilteredF001s from 'mocks/aarligKontroll/filteredF001s'
// @ts-ignore
import { sprintf } from 'sprintf-js'

export const getFilteredF001s = (fnr: string): ActionWithPayload<Array<F001FilteredResult>> => call({
  url: sprintf(urls.API_AARLIG_KONTROLL_F001_URL, { fnr }),
  method: 'POST',
  body: {
    sedTyper: ['F001'],
    sedStatuser: ['sent', 'active'],
    antallSeder: 1
  },
  expectedPayload: mockFilteredF001s(fnr),
  type: {
    request: types.AARLIG_KONTROLL_F001_SEARCH_REQUEST,
    success: types.AARLIG_KONTROLL_F001_SEARCH_SUCCESS,
    failure: types.AARLIG_KONTROLL_F001_SEARCH_FAILURE
  }
})

export const resetF001s = () => ({
  type: types.AARLIG_KONTROLL_F001_SEARCH_RESET
})
