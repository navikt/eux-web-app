import { ActionWithPayload, call } from '@navikt/fetch'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { F001SakSearchContext, FilteredF001Sak, UtkastF001 } from 'declarations/types'
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
  cascadeFailureError: true,
  context: { fnr } as F001SakSearchContext,
  type: {
    request: types.AARLIG_KONTROLL_FILTERED_F001_SAK_REQUEST,
    success: types.AARLIG_KONTROLL_FILTERED_F001_SAK_SUCCESS,
    failure: types.AARLIG_KONTROLL_FILTERED_F001_SAK_FAILURE
  }
})

export const resetFilteredF001Saks = () => ({
  type: types.AARLIG_KONTROLL_FILTERED_F001_SAK_RESET
})

export const resetUtkastF001 = () => ({
  type: types.AARLIG_KONTROLL_UTKAST_F001_RESET
})

export const createUtkastF001 = (
  rinaSakId: string,
  sedId: string
): ActionWithPayload<UtkastF001> => call({
  method: 'POST',
  url: sprintf(urls.API_AARLIG_KONTROLL_UTKAST_F001_URL, { rinaSakId, sedId }),
  expectedPayload: {
    sakId: 10001,
    sedId: 20001
  },
  cascadeFailureError: true,
  type: {
    request: types.AARLIG_KONTROLL_UTKAST_F001_REQUEST,
    success: types.AARLIG_KONTROLL_UTKAST_F001_SUCCESS,
    failure: types.AARLIG_KONTROLL_UTKAST_F001_FAILURE
  }
})
