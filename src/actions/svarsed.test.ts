import * as svarsedActions from 'actions/svarsed'
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

describe('actions/svarsed', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('createSed()', () => {
    const replySed: ReplySed = {
      saksnummer: '123',
      sakUrl: 'url'
    } as ReplySed
    svarsedActions.createSed(replySed)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARSED_SED_CREATE_REQUEST,
          success: types.SVARSED_SED_CREATE_SUCCESS,
          failure: types.SVARSED_SED_CREATE_FAILURE
        },
        method: 'POST',
        url: sprintf(urls.API_SED_CREATE_URL, { rinaSakId: replySed.saksnummer })
      }))
  })

  it('getFagsaker()', () => {
    const fnr = 'mockFnr'
    const sektor = 'mockSektor'
    const tema = 'mockTema'
    svarsedActions.getFagsaker(fnr, sektor, tema)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARSED_FAGSAKER_GET_REQUEST,
          success: types.SVARSED_FAGSAKER_GET_SUCCESS,
          failure: types.SVARSED_FAGSAKER_GET_FAILURE
        },
        url: sprintf(urls.API_FAGSAKER_QUERY_URL, { fnr: fnr, sektor: sektor, tema: tema })
      }))
  })

  it('getPreviewFile()', () => {
    const rinaSakId = '123'
    const replySed = {
      saksnummer: '123',
      sakUrl: 'url'
    } as ReplySed
    svarsedActions.getPreviewFile(rinaSakId, replySed)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARSED_PREVIEW_REQUEST,
          success: types.SVARSED_PREVIEW_SUCCESS,
          failure: types.SVARSED_PREVIEW_FAILURE
        },
        url: sprintf(urls.API_PREVIEW_URL, { rinaSakId: rinaSakId })
      }))
  })

  it('getSedStatus()', () => {
    const rinaSakId = '123'
    const sedId = '456'

    svarsedActions.getSedStatus(rinaSakId, sedId)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARSED_SED_STATUS_REQUEST,
          success: types.SVARSED_SED_STATUS_SUCCESS,
          failure: types.SVARSED_SED_STATUS_FAILURE
        },
        url: sprintf(urls.API_SED_STATUS_URL, { rinaSakId: rinaSakId, sedId: sedId })
      }))
  })

  it('querySaksnummerOrFnr() - saksnummer', () => {
    const saksnummerOrFnr = '123'

    svarsedActions.querySaksnummerOrFnr(saksnummerOrFnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARSED_SAKSNUMMERORFNR_QUERY_REQUEST,
          success: types.SVARSED_SAKSNUMMERORFNR_QUERY_SUCCESS,
          failure: types.SVARSED_SAKSNUMMERORFNR_QUERY_FAILURE
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

    svarsedActions.querySaksnummerOrFnr(saksnummerOrFnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARSED_SAKSNUMMERORFNR_QUERY_REQUEST,
          success: types.SVARSED_SAKSNUMMERORFNR_QUERY_SUCCESS,
          failure: types.SVARSED_SAKSNUMMERORFNR_QUERY_FAILURE
        },
        context: {
          type: 'fnr',
          saksnummerOrFnr: saksnummerOrFnr
        },
        url: sprintf(urls.API_RINASAKER_OVERSIKT_FNR_QUERY_URL, { fnr: saksnummerOrFnr })
      }))
  })

  it('querySaksnummerOrFnr() - valid dnr', () => {
    const saksnummerOrFnr = '43099015781'

    svarsedActions.querySaksnummerOrFnr(saksnummerOrFnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARSED_SAKSNUMMERORFNR_QUERY_REQUEST,
          success: types.SVARSED_SAKSNUMMERORFNR_QUERY_SUCCESS,
          failure: types.SVARSED_SAKSNUMMERORFNR_QUERY_FAILURE
        },
        context: {
          type: 'dnr',
          saksnummerOrFnr: saksnummerOrFnr
        },
        url: sprintf(urls.API_RINASAKER_OVERSIKT_DNR_QUERY_URL, { fnr: saksnummerOrFnr })
      }))
  })

  it('queryReplySed()', () => {
    const connectedSed = {
      svarsedType: 'U002',
      svarsedId: '123',
      sedType: 'U001'
    } as ConnectedSed
    const saksnummer = '456'
    const sakUrl = 'mockSakurl'
    svarsedActions.queryReplySed(connectedSed, saksnummer, sakUrl)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARSED_REPLYSED_QUERY_REQUEST,
          success: types.SVARSED_REPLYSED_QUERY_SUCCESS,
          failure: types.SVARSED_REPLYSED_QUERY_FAILURE
        },
        context: {
          saksnummer: saksnummer,
          sakUrl: sakUrl,
          sedId: '123'
        },
        url: sprintf(urls.API_RINASAK_SVARSED_QUERY_URL, {
          rinaSakId: saksnummer,
          sedId: connectedSed.sedId,
          sedType: connectedSed.svarsedType
        })
      }))
  })

  it('resetPreviewFile()', () => {
    const generatedResult = svarsedActions.resetPreviewFile()
    expect(generatedResult)
      .toMatchObject({
        type: types.SVARSED_PREVIEW_RESET
      })
  })

  it('sendSedInRina()', () => {
    const rinaSakId = '123'
    const sedId = '456'
    svarsedActions.sendSedInRina(rinaSakId, sedId)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARSED_SED_SEND_REQUEST,
          success: types.SVARSED_SED_SEND_SUCCESS,
          failure: types.SVARSED_SED_SEND_FAILURE
        },
        method: 'POST',
        url: sprintf(urls.API_SED_SEND_URL, {
          rinaSakId: rinaSakId,
          sedId: sedId
        })
      }))
  })

  it('setParentSed()', () => {
    const payload = 'payload'
    const generatedResult = svarsedActions.setParentSed(payload)
    expect(generatedResult)
      .toMatchObject({
        type: types.SVARSED_PARENTSED_SET,
        payload: payload
      })
  })

  it('setReplySed()', () => {
    const replySed = 'replySed'
    const generatedResult = svarsedActions.setReplySed(replySed)
    expect(generatedResult)
      .toMatchObject({
        type: types.SVARSED_REPLYSED_SET,
        payload: replySed
      })
  })

  it('updateReplySed()', () => {
    const needle = 'needle'
    const value = 'value'
    const generatedResult = svarsedActions.updateReplySed(needle, value)
    expect(generatedResult)
      .toMatchObject({
        type: types.SVARSED_REPLYSED_UPDATE,
        payload: {
          needle: needle,
          value: value
        }
      })
  })
})