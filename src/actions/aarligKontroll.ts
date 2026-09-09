import { ActionWithPayload, call } from '@navikt/fetch'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { Sed } from 'declarations/types'
import mockF001s from 'mocks/aarligKontroll/f001s'
// @ts-ignore
import { sprintf } from 'sprintf-js'

export const searchF001s = (fnr: string): ActionWithPayload<Array<Sed>> => call({
  url: sprintf(urls.API_AARLIG_KONTROLL_F001_URL, { fnr }),
  expectedPayload: mockF001s(fnr),
  type: {
    request: types.AARLIG_KONTROLL_F001_SEARCH_REQUEST,
    success: types.AARLIG_KONTROLL_F001_SEARCH_SUCCESS,
    failure: types.AARLIG_KONTROLL_F001_SEARCH_FAILURE
  }
})

export const resetF001s = () => ({
  type: types.AARLIG_KONTROLL_F001_SEARCH_RESET
})
