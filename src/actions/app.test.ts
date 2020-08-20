import * as appActions from 'actions/app'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { realCall as originalCall } from 'js-fetch-api'
jest.mock('js-fetch-api', () => ({
  realCall: jest.fn()
}))
const realCall: jest.Mock = originalCall as jest.Mock<typeof originalCall>

describe('actions/app', () => {
  afterEach(() => {
    realCall.mockReset()
  })

  afterAll(() => {
    realCall.mockRestore()
  })

  it('cleanData()', () => {
    const generatedResult = appActions.cleanData()
    expect(generatedResult)
      .toMatchObject({
        type: types.APP_CLEAN_DATA
      })
  })

  it('getSaksbehandler()', () => {
    appActions.getSaksbehandler()
    expect(realCall)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.APP_SAKSBEHANDLER_GET_REQUEST,
          success: types.APP_SAKSBEHANDLER_GET_SUCCESS,
          failure: types.APP_SAKSBEHANDLER_GET_FAILURE
        },
        url: urls.API_SAKSBEHANDLER_URL
      }))
  })

  it('getEnheter()', () => {
    appActions.getEnheter()
    expect(realCall)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.APP_ENHETER_GET_REQUEST,
          success: types.APP_ENHETER_GET_SUCCESS,
          failure: types.APP_ENHETER_GET_FAILURE
        },
        url: urls.API_ENHETER_URL
      }))
  })

  it('getServerinfo()', () => {
    appActions.getServerinfo()
    expect(realCall)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.APP_SERVERINFO_GET_REQUEST,
          success: types.APP_SERVERINFO_GET_SUCCESS,
          failure: types.APP_SERVERINFO_GET_FAILURE
        },
        url: urls.API_SERVERINFO_URL
      }))
  })
})
