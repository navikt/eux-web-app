import * as svarpasedActions from 'actions/svarpased'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ReplySed } from 'declarations/sed'
import { ConnectedSed } from 'declarations/types'
import { call as originalCall } from 'js-fetch-api'

const sprintf = require('sprintf-js').sprintf
jest.mock('js-fetch-api', () => ({
  call: jest.fn()
}))
const call = originalCall as jest.Mock<typeof originalCall>

describe('actions/svarpased', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('createSed()', () => {
    const replySed: ReplySed = {
      saksnummer: '123',
      sedUrl: 'url'
    } as ReplySed
    svarpasedActions.createSed(replySed)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARPASED_SED_CREATE_REQUEST,
          success: types.SVARPASED_SED_CREATE_SUCCESS,
          failure: types.SVARPASED_SED_CREATE_FAILURE
        },
        method: 'POST',
        url: sprintf(urls.API_SED_CREATE_URL, { rinaSakId: replySed.saksnummer }),
      }))
  })

  it('getFagsaker()', () => {
    const fnr = 'mockFnr'
    const sektor = 'mockSektor'
    const tema = 'mockTema'
    svarpasedActions.getFagsaker(fnr, sektor, tema)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARPASED_FAGSAKER_GET_REQUEST,
          success: types.SVARPASED_FAGSAKER_GET_SUCCESS,
          failure: types.SVARPASED_FAGSAKER_GET_FAILURE
        },
        url: sprintf(urls.API_FAGSAKER_QUERY_URL, { fnr: fnr, sektor: sektor, tema: tema }),
      }))

  })

  it('getPreviewFile()', () => {
    const rinaSakId = '123'
    const replySed = {
      saksnummer: '123',
      sedUrl: 'url'
    } as ReplySed
    svarpasedActions.getPreviewFile(rinaSakId, replySed)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARPASED_PREVIEW_REQUEST,
          success: types.SVARPASED_PREVIEW_SUCCESS,
          failure: types.SVARPASED_PREVIEW_FAILURE
        },
        url: sprintf(urls.API_PREVIEW_URL, { rinaSakId: rinaSakId })
      }))
  })

  it('querySaksnummerOrFnr() - saksnummer', () => {
    const saksnummerOrFnr = '123'

    svarpasedActions.querySaksnummerOrFnr(saksnummerOrFnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARPASED_SAKSNUMMERORFNR_QUERY_REQUEST,
          success: types.SVARPASED_SAKSNUMMERORFNR_QUERY_SUCCESS,
          failure: types.SVARPASED_SAKSNUMMERORFNR_QUERY_FAILURE
        },
        context: {
          type: 'saksnummer',
          saksnummerOrFnr: saksnummerOrFnr
        },
        url: sprintf(urls.API_RINASAKER_OVERSIKT_SAKID_QUERY_URL, { rinaSakId: saksnummerOrFnr })
      }))
  })

  it('querySaksnummerOrFnr() - valid fnr', () => {
    const saksnummerOrFnr = '24053626692'

    svarpasedActions.querySaksnummerOrFnr(saksnummerOrFnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARPASED_SAKSNUMMERORFNR_QUERY_REQUEST,
          success: types.SVARPASED_SAKSNUMMERORFNR_QUERY_SUCCESS,
          failure: types.SVARPASED_SAKSNUMMERORFNR_QUERY_FAILURE
        },
        context: {
          type: 'fnr',
          saksnummerOrFnr: saksnummerOrFnr
        },
        url: sprintf(urls.API_RINASAKER_OVERSIKT_FNR_QUERY_URL, { fnr: saksnummerOrFnr })
      }))
  })

  it('querySaksnummerOrFnr() - valid dnr', () => {
    const saksnummerOrFnr = '64053626692'

    svarpasedActions.querySaksnummerOrFnr(saksnummerOrFnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARPASED_SAKSNUMMERORFNR_QUERY_REQUEST,
          success: types.SVARPASED_SAKSNUMMERORFNR_QUERY_SUCCESS,
          failure: types.SVARPASED_SAKSNUMMERORFNR_QUERY_FAILURE
        },
        context: {
          type: 'fnr',
          saksnummerOrFnr: saksnummerOrFnr
        },
        url: sprintf(urls.API_RINASAKER_OVERSIKT_DNR_QUERY_URL, { fnr: saksnummerOrFnr })
      }))
  })

  it('queryReplySed()', () => {
    const connectedSed = {
      svarsedType: 'U002',
      sedId: '123',
      sedUrl: 'mockSedUrl'
    } as ConnectedSed
    const saksnummer = '456'

    svarpasedActions.queryReplySed(connectedSed, saksnummer)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARPASED_REPLYSED_QUERY_REQUEST,
          success: types.SVARPASED_REPLYSED_QUERY_SUCCESS,
          failure: types.SVARPASED_REPLYSED_QUERY_FAILURE
        },
        context: {
          saksnummer: saksnummer,
          sedUrl: connectedSed.sedUrl
        },
        url: sprintf(urls.API_RINASAK_SVARSED_QUERY_URL, {
          rinaSakId: saksnummer,
          sedId: connectedSed.sedId,
          sedType: connectedSed.svarsedType
        }),
      }))
  })



})
