import * as sakActions from 'actions/sak'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { call as originalCall } from '@navikt/fetch'

jest.mock('@navikt/fetch', () => ({
  call: jest.fn()
}))
const call: jest.Mock = originalCall as unknown as jest.Mock<typeof originalCall>
// @ts-ignore
import { sprintf } from 'sprintf-js'

describe('actions/sak', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('sakReset()', () => {
    expect(sakActions.sakReset()).toMatchObject({
      type: types.SAK_RESET
    })
  })

  it('getFagsaker()', () => {
    const fnr = '12345678901'
    const sektor = 'mockSektor'
    const tema = 'mockTema'
    sakActions.getFagsaker(fnr, sektor, tema)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_FAGSAKER_REQUEST,
          success: types.SAK_FAGSAKER_SUCCESS,
          failure: types.SAK_FAGSAKER_FAILURE
        },
        url: sprintf(urls.API_GET_FAGSAKER_URL, { fnr, tema })
      }))
  })

  it('getInstitusjoner()', () => {
    const buctype = 'P_BUC_MOCK'
    const landkode = "NOR"
    sakActions.getInstitusjoner(buctype, landkode)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_INSTITUSJONER_REQUEST,
          success: types.SAK_INSTITUSJONER_SUCCESS,
          failure: types.SAK_INSTITUSJONER_FAILURE
        },
        url: sprintf(urls.API_INSTITUSJONER_URL, { buctype, landkode })
      }))
  })


  it('resetFagsaker()', () => {
    expect(sakActions.resetFagsaker())
      .toMatchObject({
        type: types.SAK_FAGSAKER_RESET
      })
  })

  it('resetSentSed()', () => {
    expect(sakActions.resetSentSed())
      .toMatchObject({
        type: types.SAK_SEND_RESET
      })
  })

  it('setProperty()', () => {
    const key = 'key'
    const value = 'value'
    expect(sakActions.setProperty(key, value)).toMatchObject({
      type: types.SAK_PROPERTY_SET,
      payload: { key, value }
    })
  })
})
