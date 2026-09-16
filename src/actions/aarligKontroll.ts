import { ActionWithPayload, call } from '@navikt/fetch'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { FilteredF001Sak } from 'declarations/types'
import mockFilteredF001s from 'mocks/aarligKontroll/filteredF001s'
// @ts-ignore
import { sprintf } from 'sprintf-js'

export const getFilteredF001Saks = (fnr: string): ActionWithPayload<Array<FilteredF001Sak>> => call({
  url: sprintf(urls.API_AARLIG_KONTROLL_FILTERED_F001_SAK_URL, { fnr }),
  method: 'POST',
  body: {
    sedTyper: ['F001'],
    sedStatuser: ['sent', 'active'],
    antallSeder: 1
  },
  expectedPayload: mockFilteredF001s(fnr),
  type: {
    request: types.AARLIG_KONTROLL_FILTERED_F001_SAK_REQUEST,
    success: types.AARLIG_KONTROLL_FILTERED_F001_SAK_SUCCESS,
    failure: types.AARLIG_KONTROLL_FILTERED_F001_SAK_FAILURE
  }
})

export const resetFilteredF001Saks = () => ({
  type: types.AARLIG_KONTROLL_FILTERED_F001_SAK_RESET
})
