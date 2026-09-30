import * as svarsedActions from 'actions/svarsed'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ReplySed } from 'declarations/sed'
import { Sak, Sed } from 'declarations/types'
import { call as originalCall } from '@navikt/fetch'

// @ts-ignore
import { sprintf } from 'sprintf-js'
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

  describe.each(['H001', 'H002'])('typed API for %s', (sedType: string) => {
    const typed = sedType.toLowerCase()
    const sak = { sakId: '456', sakUrl: 'mockSakurl' } as Sak
    const bruker = {
      personInfo: { fornavn: 'Ola' },
      anmodning: { adresseTyper: ['bosted'], dokumentasjon: { dokument: 'doc' } },
      negativtSvar: [{ grunn: 'first' }, { grunn: 'second' }],
      vedlegg: { type: ['søknad'], andreDokumenter: ['other'] }
    }
    const replySed = {
      sedType,
      sedVersjon: '4.4',
      sak: { sakId: '123', sakUrl: 'url' },
      sed: { sedId: '789' },
      attachments: [],
      bruker
    } as unknown as ReplySed

    it('createSed() posts the nested body to the typed endpoint', () => {
      svarsedActions.createSed(replySed)
      expect(call).toBeCalledWith(expect.objectContaining({
        method: 'POST',
        url: sprintf(urls.API_SED_CREATE_BY_TYPE_URL, { rinaSakId: '123', sedType: typed }),
        body: { sedType, sedVersjon: '4.4', bruker }
      }))
      expect(sprintf(urls.API_SED_CREATE_BY_TYPE_URL, { rinaSakId: '123', sedType: typed })).toMatch(new RegExp(`/v1/rinasaker/123/${typed}$`))
    })

    it('updateSed() puts the nested body to the typed endpoint', () => {
      svarsedActions.updateSed(replySed)
      expect(call).toBeCalledWith(expect.objectContaining({
        method: 'PUT',
        url: sprintf(urls.API_SED_UPDATE_BY_TYPE_URL, { rinaSakId: '123', sedType: typed, sedId: '789' }),
        body: { sedType, sedVersjon: '4.4', bruker }
      }))
    })

    it('getPreviewFile() uses the typed pdf endpoint', () => {
      svarsedActions.getPreviewFile('123', replySed)
      expect(call).toBeCalledWith(expect.objectContaining({
        method: 'POST',
        url: sprintf(urls.API_SED_PREVIEW_BY_TYPE_URL, { rinaSakId: '123', sedType: typed }),
        responseType: 'pdf'
      }))
    })

    it('editSed() uses the typed endpoint', () => {
      svarsedActions.editSed({ sedId: '789', sedType } as Sed, sak)
      expect(call).toBeCalledWith(expect.objectContaining({
        url: sprintf(urls.API_SED_EDIT_BY_TYPE_URL, { rinaSakId: '456', sedType: typed, sedId: '789' })
      }))
    })

    it('deleteSed() uses the typed endpoint', () => {
      svarsedActions.deleteSed('456', '789', sedType)
      expect(call).toBeCalledWith(expect.objectContaining({
        method: 'DELETE',
        url: sprintf(urls.API_SED_DELETE_BY_TYPE_URL, { rinaSakId: '456', sedType: typed, sedId: '789' })
      }))
    })
  })

  it('replyToSed() for H002 gets the typed draft (H001 parent) before it is saved as typed H002', () => {
    const sak = { sakId: '456', sakUrl: 'mockSakurl' } as Sak
    svarsedActions.replyToSed({ sedId: '789', sedType: 'H001', svarsedType: 'H002' } as Sed, sak)
    expect(call).toBeCalledWith(expect.objectContaining({
      url: sprintf(urls.API_SED_DRAFT_BY_TYPE_URL, {
        rinaSakId: '456',
        sedType: 'h002',
        parentSedId: '789',
        parentSedType: 'h001'
      })
    }))
    expect(call.mock.calls[0][0]).not.toHaveProperty('method')
    expect(sprintf(urls.API_SED_DRAFT_BY_TYPE_URL, {
      rinaSakId: '456', sedType: 'h002', parentSedId: '789', parentSedType: 'h001'
    })).toMatch(/\/v1\/rinasaker\/456\/h002\/utkast\/789\?parentSedType=h001$/)
  })

  it('other SED types keep using the legacy endpoints', () => {
    const replySed = { sedType: 'F002', sak: { sakId: '123' }, sed: { sedId: '789' } } as unknown as ReplySed
    svarsedActions.createSed(replySed)
    expect(call).toHaveBeenLastCalledWith(expect.objectContaining({
      url: sprintf(urls.API_SED_CREATE_URL, { rinaSakId: '123' })
    }))
    svarsedActions.updateSed(replySed)
    expect(call).toHaveBeenLastCalledWith(expect.objectContaining({
      url: sprintf(urls.API_SED_UPDATE_URL, { rinaSakId: '123', sedId: '789' })
    }))
    svarsedActions.getPreviewFile('123', replySed)
    expect(call).toHaveBeenLastCalledWith(expect.objectContaining({
      url: sprintf(urls.API_PREVIEW_URL, { rinaSakId: '123' })
    }))
    svarsedActions.replyToSed({ sedId: '789', sedType: 'F001', svarsedType: 'F002' } as Sed, { sakId: '456' } as Sak)
    expect(call).toHaveBeenLastCalledWith(expect.objectContaining({
      url: sprintf(urls.API_RINASAK_SVARSED_QUERY_URL, { rinaSakId: '456', sedId: '789', sedType: 'F002' })
    }))
  })
})
