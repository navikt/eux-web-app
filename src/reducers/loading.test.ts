import loadingReducer, { initialLoadingState } from './loading'
import * as types from 'constants/actionTypes'

describe('reducers/loading', () => {
  const simulate = (type: string, param: string, initialBool: boolean) => {
    expect(
      loadingReducer({
        ...initialLoadingState,
        [param]: initialBool
      }, {
        type: type
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

  it('SAK_ARBEIDSPERIODER_GET_REQUEST', () => {
    simulateRequest(types.SAK_ARBEIDSPERIODER_GET_REQUEST, 'gettingArbeidsperioder')
  })

  it('SAK_ARBEIDSPERIODER_GET_SUCCESS', () => {
    simulateSuccess(types.SAK_ARBEIDSPERIODER_GET_SUCCESS, 'gettingArbeidsperioder')
  })

  it('SAK_ARBEIDSPERIODER_GET_FAILURE', () => {
    simulateFailure(types.SAK_ARBEIDSPERIODER_GET_FAILURE, 'gettingArbeidsperioder')
  })

  it('VEDLEGG_DOKUMENT_GET_REQUEST', () => {
    simulateRequest(types.VEDLEGG_DOKUMENT_GET_REQUEST, 'gettingDokument')
  })

  it('VEDLEGG_DOKUMENT_GET_SUCCESS', () => {
    simulateSuccess(types.VEDLEGG_DOKUMENT_GET_SUCCESS, 'gettingDokument')
  })

  it('VEDLEGG_DOKUMENT_GET_FAILURE', () => {
    simulateFailure(types.VEDLEGG_DOKUMENT_GET_FAILURE, 'gettingDokument')
  })

  it('SAK_FAGSAKER_GET_REQUEST', () => {
    simulateRequest(types.SAK_FAGSAKER_GET_REQUEST, 'gettingFagsaker')
  })

  it('SAK_FAGSAKER_GET_SUCCESS', () => {
    simulateSuccess(types.SAK_FAGSAKER_GET_SUCCESS, 'gettingFagsaker')
  })

  it('SAK_FAGSAKER_GET_FAILURE', () => {
    simulateFailure(types.SAK_FAGSAKER_GET_FAILURE, 'gettingFagsaker')
  })

  it('SAK_INSTITUSJONER_GET_REQUEST', () => {
    simulateRequest(types.SAK_INSTITUSJONER_GET_REQUEST, 'gettingInstitusjoner')
  })

  it('SAK_INSTITUSJONER_GET_SUCCESS', () => {
    simulateSuccess(types.SAK_INSTITUSJONER_GET_SUCCESS, 'gettingInstitusjoner')
  })

  it('SAK_INSTITUSJONER_GET_FAILURE', () => {
    simulateFailure(types.SAK_INSTITUSJONER_GET_FAILURE, 'gettingInstitusjoner')
  })

  it('SAK_LANDKODER_GET_REQUEST', () => {
    simulateRequest(types.SAK_LANDKODER_GET_REQUEST, 'gettingLandkoder')
  })

  it('SAK_LANDKODER_GET_SUCCESS', () => {
    simulateSuccess(types.SAK_LANDKODER_GET_SUCCESS, 'gettingLandkoder')
  })

  it('SAK_LANDKODER_GET_FAILURE', () => {
    simulateFailure(types.SAK_LANDKODER_GET_FAILURE, 'gettingLandkoder')
  })

  it('SAK_PERSON_GET_REQUEST', () => {
    simulateRequest(types.SAK_PERSON_GET_REQUEST, 'gettingPerson')
  })

  it('SAK_PERSON_GET_SUCCESS', () => {
    simulateSuccess(types.SAK_PERSON_GET_SUCCESS, 'gettingPerson')
  })

  it('SAK_PERSON_GET_FAILURE', () => {
    simulateFailure(types.SAK_PERSON_GET_FAILURE, 'gettingPerson')
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

  it('APP_SAKSBEHANDLER_GET_REQUEST', () => {
    simulateRequest(types.APP_SAKSBEHANDLER_GET_REQUEST, 'gettingSaksbehandler')
  })

  it('APP_SAKSBEHANDLER_GET_SUCCESS', () => {
    simulateSuccess(types.APP_SAKSBEHANDLER_GET_SUCCESS, 'gettingSaksbehandler')
  })

  it('APP_SAKSBEHANDLER_GET_FAILURE', () => {
    simulateFailure(types.APP_SAKSBEHANDLER_GET_FAILURE, 'gettingSaksbehandler')
  })

  it('APP_SERVERINFO_GET_REQUEST', () => {
    simulateRequest(types.APP_SERVERINFO_GET_REQUEST, 'gettingServerinfo')
  })

  it('APP_SERVERINFO_GET_SUCCESS', () => {
    simulateSuccess(types.APP_SERVERINFO_GET_SUCCESS, 'gettingServerinfo')
  })

  it('APP_SERVERINFO_GET_FAILURE', () => {
    simulateFailure(types.APP_SERVERINFO_GET_FAILURE, 'gettingServerinfo')
  })

  it('APP_CLEAN_DATA', () => {
    expect(
      loadingReducer({}, {
        type: types.APP_CLEAN_DATA
      })
    ).toEqual(initialLoadingState)
  })
})
