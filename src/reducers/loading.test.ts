import loadingReducer, { initialLoadingState } from './loading'
import * as types from 'constants/actionTypes'

describe('reducers/loading', () => {
  const simulate = (type: string, param: string, initialBool: boolean) => {
    expect(
      loadingReducer({
        ...initialLoadingState,
        [param]: initialBool
      }, {
        type
      })
    ).toEqual({
      ...initialLoadingState,
      [param]: !initialBool
    })
  }

  const simulateRequest = (type: string, param: string) => {
    return simulate(type, param, false)
  }

  const simulateSuccess = (type: string, param: string) => {
    return simulate(type, param, true)
  }

  const simulateFailure = (type: string, param: string) => {
    return simulate(type, param, true)
  }

  it('SOMETHING_ERROR', () => {
    expect(
      loadingReducer({}, {
        type: 'SOMETHING/ERROR'
      })
    ).toEqual(initialLoadingState)
  })

  it('ARBEIDSPERIODER_REQUEST', () => {
    simulateRequest(types.ARBEIDSPERIODER_REQUEST, 'gettingArbeidsperioder')
  })

  it('ARBEIDSPERIODER_SUCCESS', () => {
    simulateSuccess(types.ARBEIDSPERIODER_SUCCESS, 'gettingArbeidsperioder')
  })

  it('ARBEIDSPERIODER_FAILURE', () => {
    simulateFailure(types.ARBEIDSPERIODER_FAILURE, 'gettingArbeidsperioder')
  })

  it('VEDLEGG_DOKUMENT_REQUEST', () => {
    simulateRequest(types.VEDLEGG_DOKUMENT_REQUEST, 'gettingDokument')
  })

  it('VEDLEGG_DOKUMENT_SUCCESS', () => {
    simulateSuccess(types.VEDLEGG_DOKUMENT_SUCCESS, 'gettingDokument')
  })

  it('VEDLEGG_DOKUMENT_FAILURE', () => {
    simulateFailure(types.VEDLEGG_DOKUMENT_FAILURE, 'gettingDokument')
  })

  it('SAK_FAGSAKER_REQUEST', () => {
    simulateRequest(types.SAK_FAGSAKER_REQUEST, 'gettingFagsaker')
  })

  it('SAK_FAGSAKER_SUCCESS', () => {
    simulateSuccess(types.SAK_FAGSAKER_SUCCESS, 'gettingFagsaker')
  })

  it('SAK_FAGSAKER_FAILURE', () => {
    simulateFailure(types.SAK_FAGSAKER_FAILURE, 'gettingFagsaker')
  })

  it('SAK_INSTITUSJONER_REQUEST', () => {
    simulateRequest(types.SAK_INSTITUSJONER_REQUEST, 'gettingInstitusjoner')
  })

  it('SAK_INSTITUSJONER_SUCCESS', () => {
    simulateSuccess(types.SAK_INSTITUSJONER_SUCCESS, 'gettingInstitusjoner')
  })

  it('SAK_INSTITUSJONER_FAILURE', () => {
    simulateFailure(types.SAK_INSTITUSJONER_FAILURE, 'gettingInstitusjoner')
  })

  it('PERSON_SEARCH_REQUEST', () => {
    simulateRequest(types.PERSON_SEARCH_REQUEST, 'searchingPerson')
  })

  it('PERSON_SEARCH_SUCCESS', () => {
    simulateSuccess(types.PERSON_SEARCH_SUCCESS, 'searchingPerson')
  })

  it('PERSON_SEARCH_FAILURE', () => {
    simulateFailure(types.PERSON_SEARCH_FAILURE, 'searchingPerson')
  })

  it('SAK_SEND_REQUEST', () => {
    simulateRequest(types.SAK_SEND_REQUEST, 'sendingSak')
  })

  it('SAK_SEND_SUCCESS', () => {
    simulateSuccess(types.SAK_SEND_SUCCESS, 'sendingSak')
  })

  it('SAK_SEND_FAILURE', () => {
    simulateFailure(types.SAK_SEND_FAILURE, 'sendingSak')
  })

  it('VEDLEGG_POST_REQUEST', () => {
    simulateRequest(types.VEDLEGG_POST_REQUEST, 'sendingVedlegg')
  })

  it('VEDLEGG_POST_SUCCESS', () => {
    simulateSuccess(types.VEDLEGG_POST_SUCCESS, 'sendingVedlegg')
  })

  it('VEDLEGG_POST_FAILURE', () => {
    simulateFailure(types.VEDLEGG_POST_FAILURE, 'sendingVedlegg')
  })

  it('APP_SAKSBEHANDLER_REQUEST', () => {
    simulateRequest(types.APP_SAKSBEHANDLER_REQUEST, 'gettingSaksbehandler')
  })

  it('APP_SAKSBEHANDLER_SUCCESS', () => {
    simulateSuccess(types.APP_SAKSBEHANDLER_SUCCESS, 'gettingSaksbehandler')
  })

  it('APP_SAKSBEHANDLER_FAILURE', () => {
    simulateFailure(types.APP_SAKSBEHANDLER_FAILURE, 'gettingSaksbehandler')
  })

  it('APP_SERVERINFO_REQUEST', () => {
    simulateRequest(types.APP_SERVERINFO_REQUEST, 'gettingServerinfo')
  })

  it('APP_SERVERINFO_SUCCESS', () => {
    simulateSuccess(types.APP_SERVERINFO_SUCCESS, 'gettingServerinfo')
  })

  it('APP_SERVERINFO_FAILURE', () => {
    simulateFailure(types.APP_SERVERINFO_FAILURE, 'gettingServerinfo')
  })

  it('APP_RESET', () => {
    expect(
      loadingReducer({}, {
        type: types.APP_RESET
      })
    ).toEqual(initialLoadingState)
  })
})
