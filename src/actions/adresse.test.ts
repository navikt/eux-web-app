import * as adresseActions from 'actions/adresse'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import mockItems from 'mocks/attachments/items'
import { call as originalCall } from 'js-fetch-api'
const sprintf = require('sprintf-js').sprintf

jest.mock('js-fetch-api', () => ({
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
      context: mockItems[0],
      url: sprintf(urls.API_ADRESSE_URL, { fnr })
    }))
  })
})
