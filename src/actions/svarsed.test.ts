import * as svarsedActions from 'actions/svarsed'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ReplySed } from 'declarations/sed'
import { Sak, Sed } from 'declarations/types'
import { call as originalCall } from '@navikt/fetch'

const sprintf = require('sprintf-js').sprintf
jest.mock('@navikt/fetch', () => ({
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
      sak: {
        sakId: '123',
        sakUrl: 'url'
      }
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
        url: sprintf(urls.API_SED_CREATE_URL, { rinaSakId: replySed.sak?.sakId })
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
          request: types.SVARSED_FAGSAKER_REQUEST,
          success: types.SVARSED_FAGSAKER_SUCCESS,
          failure: types.SVARSED_FAGSAKER_FAILURE
        },
        url: sprintf(urls.API_GET_FAGSAKER_URL, { fnr, tema })
      }))
  })

  // it('getPreviewFile()', () => {
  //   const rinaSakId = '123'
  //   const replySed = {
  //     sak: {
  //       sakId: '123',
  //       sakUrl: 'url'
  //     }
  //   } as ReplySed
  //   svarsedActions.getPreviewFile(rinaSakId, replySed)
  //   expect(call)
  //     .toBeCalledWith(expect.objectContaining({
  //       type: {
  //         request: types.SVARSED_PREVIEW_REQUEST,
  //         success: types.SVARSED_PREVIEW_SUCCESS,
  //         failure: types.SVARSED_PREVIEW_FAILURE
  //       },
  //       url: sprintf(urls.API_PREVIEW_URL, { rinaSakId: replySed.sak?.sakId })
  //     }))
  // })

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
        url: sprintf(urls.API_SED_STATUS_URL, { rinaSakId, sedId })
      }))
  })

  it('querySaks() - saksnummer', () => {
    const saksnummerOrFnr = '123'

    svarsedActions.querySaks(saksnummerOrFnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARSED_SAKS_REQUEST,
          success: types.SVARSED_SAKS_SUCCESS,
          failure: types.SVARSED_SAKS_FAILURE
        },
        context: {
          type: 'saksnummer',
          saksnummerOrFnr
        },
        url: sprintf(urls.API_RINASAKER_OVERSIKT_SAKID_QUERY_URL, { rinaSakId: saksnummerOrFnr })
      }))
  })

  it('querySaks() - valid fnr', () => {
    const saksnummerOrFnr = '24053626692'

    svarsedActions.querySaks(saksnummerOrFnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARSED_SAKS_REQUEST,
          success: types.SVARSED_SAKS_SUCCESS,
          failure: types.SVARSED_SAKS_FAILURE
        },
        context: {
          type: 'fnr',
          saksnummerOrFnr
        },
        url: sprintf(urls.API_RINASAKER_OVERSIKT_FNR_DNR_NPID_QUERY_URL, { fnr: saksnummerOrFnr })
      }))
  })

  it('querySaks() - valid dnr', () => {
    const saksnummerOrFnr = '43099015781'

    svarsedActions.querySaks(saksnummerOrFnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARSED_SAKS_REQUEST,
          success: types.SVARSED_SAKS_SUCCESS,
          failure: types.SVARSED_SAKS_FAILURE
        },
        context: {
          type: 'dnr',
          saksnummerOrFnr
        },
        url: sprintf(urls.API_RINASAKER_OVERSIKT_FNR_DNR_NPID_QUERY_URL, { fnr: saksnummerOrFnr })
      }))
  })

  it('replyToSed()', () => {
    const connectedSed = {
      svarsedType: 'U002',
      svarsedId: '123',
      sedType: 'U001'
    } as Sed
    const sak = {
      sakId: '456',
      sakUrl: 'mockSakurl'
    } as Sak
    svarsedActions.replyToSed(connectedSed, sak)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SVARSED_REPLYTOSED_REQUEST,
          success: types.SVARSED_REPLYTOSED_SUCCESS,
          failure: types.SVARSED_REPLYTOSED_FAILURE
        },
        context: {
          sak,
          connectedSed
        },
        url: sprintf(urls.API_RINASAK_SVARSED_QUERY_URL, {
          rinaSakId: sak.sakId,
          sedId: connectedSed.sedId,
          sedType: connectedSed.svarsedType
        })
      }))
  })

  it('resetPreviewSvarSed()', () => {
    expect(svarsedActions.resetPreviewSvarSed()).toMatchObject({
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
        url: sprintf(urls.API_SED_SEND_URL, { rinaSakId, sedId })
      }))
  })

  it('setReplySed()', () => {
    const replySed = 'replySed'
    expect(svarsedActions.setReplySed(replySed)).toMatchObject({
      type: types.SVARSED_REPLYSED_SET,
      payload: replySed
    })
  })

  it('updateReplySed()', () => {
    const needle = 'needle'
    const value = 'value'
    const generatedResult = svarsedActions.updateReplySed(needle, value)
    expect(generatedResult).toMatchObject({
      type: types.SVARSED_REPLYSED_UPDATE,
      payload: { needle, value }
    })
  })
})
