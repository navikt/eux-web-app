import * as personActions from 'actions/person'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { call as originalCall } from '@navikt/fetch'

const sprintf = require('sprintf-js').sprintf
jest.mock('@navikt/fetch', () => ({
  call: jest.fn()
}))
const call = originalCall as jest.Mock<typeof originalCall>

describe('actions/persons', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('resetPerson()', () => {
    expect(personActions.resetPerson()).toMatchObject({
      type: types.PERSON_SEARCH_RESET
    })
  })

  it('searchPerson()', () => {
    const fnr = 'mockFnr'
    personActions.searchPerson(fnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.PERSON_SEARCH_REQUEST,
          success: types.PERSON_SEARCH_SUCCESS,
          failure: types.PERSON_SEARCH_FAILURE
        },
        url: sprintf(urls.API_PERSONER_URL, { fnr })
      }))
  })

  it('searchPersonRelated()', () => {
    const fnr = 'mockFnr'
    personActions.searchPersonRelated(fnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.PERSON_RELATERT_SEARCH_REQUEST,
          success: types.PERSON_RELATERT_SEARCH_SUCCESS,
          failure: types.PERSON_RELATERT_SEARCH_FAILURE
        },
        url: sprintf(urls.API_PERSONER_URL, { fnr })
      }))
  })
})
