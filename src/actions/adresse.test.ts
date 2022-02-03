import * as adresseActions from 'actions/adresse'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { call as originalCall } from '@navikt/fetch'
const sprintf = require('sprintf-js').sprintf

jest.mock('@navikt/fetch', () => ({
  call: jest.fn()
}))
const call: jest.Mock = originalCall as unknown as jest.Mock<typeof originalCall>

describe('actions/adresse', () => {
  it('resetAdresse()', () => {
    expect(adresseActions.resetAdresse()).toMatchObject({
      type: types.ADRESSE_SEARCH_RESET
    })
  })

  it('searchAdresse()', () => {
    const fnr = '123'
    adresseActions.searchAdresse(fnr)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.ADRESSE_SEARCH_REQUEST,
        success: types.ADRESSE_SEARCH_SUCCESS,
        failure: types.ADRESSE_SEARCH_FAILURE
      },
      url: sprintf(urls.API_ADRESSE_URL, { fnr })
    }))
  })
})
