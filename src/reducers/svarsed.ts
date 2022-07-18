import * as types from 'constants/actionTypes'
import { H001Sed, Kjoenn, ReplySed, X008Sed, X011Sed, X012Sed, XSed } from 'declarations/sed.d'
import { CreateSedResponse, FagSaker, Institusjon, Sak, Saks, Sed } from 'declarations/types.d'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { AnyAction } from 'redux'

export interface SvarsedState {
  fagsaker: FagSaker | null | undefined
  deletedSak: any | null | undefined
  institusjoner: Array<Institusjon> | undefined
  mottakere: any | undefined
  personRelatert: any
  previewReplySed: ReplySed | null | undefined
  previewFile: Blob | null | undefined
  replySed: ReplySed | null | undefined
  originalReplySed: ReplySed | null | undefined
  replySedChanged: boolean
  saks: Saks | null | undefined
  currentSak: Sak | undefined
  sedCreatedResponse: CreateSedResponse | null | undefined
  sedSendResponse: any | null | undefined
  sedStatus: {[k in string]: string | null}
}

export const initialSvarsedState: SvarsedState = {
  fagsaker: undefined,
  deletedSak: undefined,
  institusjoner: undefined,
  mottakere: undefined,
  personRelatert: undefined,
  // replySED used for preview
  previewReplySed: undefined,
  // binary PDF file for SED preview,
  previewFile: undefined,
  // the working reply sed
  replySed: undefined,
  // the original reply sed, to be restored when <nullstill> button is clicked
  originalReplySed: undefined,
  // keep tracking if reply sed has changed
  replySedChanged: false,
  saks: undefined,
  currentSak: undefined,
  sedCreatedResponse: undefined,
  sedSendResponse: undefined,
  sedStatus: {}
}

const svarsedReducer = (
  state: SvarsedState = initialSvarsedState,
  action: AnyAction
): SvarsedState => {
  switch (action.type) {
    case types.APP_RESET:
      return initialSvarsedState

    case types.SVARSED_RESET:
      return {
        ...state,
        replySed: undefined,
        originalReplySed: undefined,
        replySedChanged: false
      }

    case types.SVARSED_FAGSAKER_RESET:
    case types.SVARSED_FAGSAKER_REQUEST:
      return {
        ...state,
        fagsaker: undefined
      }

    case types.SVARSED_FAGSAKER_SUCCESS:
      return {
        ...state,
        fagsaker: (action as ActionWithPayload).payload
      }

    case types.SVARSED_FAGSAKER_FAILURE:
      return {
        ...state,
        fagsaker: null
      }

    case types.SVARSED_REPLYTOSED_REQUEST:
      return {
        ...state,
        sedCreatedResponse: undefined,
        sedSendResponse: undefined,
        replySedChanged: false,
        replySed: undefined,
        originalReplySed: undefined
      }

    case types.SVARSED_REPLYTOSED_SUCCESS: {
      const newReplySed: ReplySed | null | undefined = {
        ...(action as ActionWithPayload).payload,
        sak: (action as ActionWithPayload).context.sak,
        sed: undefined // so we can signal this SED as a SED that needs to be created, not updated
      }
      return {
        ...state,
        replySed: newReplySed,
        originalReplySed: newReplySed,
        replySedChanged: false
      }
    }

    case types.SVARSED_REPLYTOSED_FAILURE:
      return {
        ...state,
        replySedChanged: false,
        replySed: null,
        originalReplySed: null
      }

    case types.SVARSED_EDIT_REQUEST:
      return {
        ...state,
        sedCreatedResponse: undefined,
        sedSendResponse: undefined
      }

    case types.SVARSED_EDIT_SUCCESS: {
      const newReplySed = {
        ...(action as ActionWithPayload).payload,
        sak: (action as ActionWithPayload).context.sak,
        sed: (action as ActionWithPayload).context.sed
      }
      return {
        ...state,
        replySed: newReplySed,
        originalReplySed: newReplySed,
        replySedChanged: false
      }
    }

    case types.SVARSED_EDIT_FAILURE:
      return {
        ...state,
        replySed: null,
        originalReplySed: null,
        replySedChanged: false
      }

    case types.SVARSED_INSTITUSJONER_REQUEST:
      return {
        ...state,
        institusjoner: undefined
      }

    case types.SVARSED_INSTITUSJONER_SUCCESS:
      return {
        ...state,
        institusjoner: (action as ActionWithPayload).payload
      }

    case types.SVARSED_MOTTAKERE_ADD_RESET:
      return {
        ...state,
        institusjoner: undefined,
        mottakere: undefined
      }

    case types.SVARSED_MOTTAKERE_ADD_SUCCESS:

      return {
        ...state,
        mottakere: action.payload,
        currentSak: {
          ...(state.currentSak as Sak),
          motpart: (state.currentSak?.motpart ?? []).concat(action.context.mottakere)
        }
      }

    case types.SVARSED_PREVIEW_SUCCESS:
      return {
        ...state,
        previewReplySed: (action as ActionWithPayload).payload
      }

    case types.SVARSED_PREVIEW_FAILURE:
      return {
        ...state,
        previewReplySed: null
      }

    case types.SVARSED_PREVIEW_REQUEST:
      return {
        ...state,
        previewReplySed: undefined
      }

    case types.SVARSED_PREVIEW_RESET:
      return {
        ...state,
        previewReplySed: undefined,
        previewFile: undefined
      }

    case types.SVARSED_PREVIEW_FILE_SUCCESS:
      return {
        ...state,
        previewFile: (action as ActionWithPayload).payload
      }

    case types.SVARSED_PREVIEW_FILE_FAILURE:
      return {
        ...state,
        previewFile: null
      }

    case types.SVARSED_PREVIEW_FILE_REQUEST:
      return {
        ...state,
        previewFile: undefined
      }

    case types.SVARSED_CURRENTSAK_SET:
      return {
        ...state,
        currentSak: (action as ActionWithPayload).payload
      }

    case types.SVARSED_SAK_DELETE_REQUEST:
      return {
        ...state,
        deletedSak: undefined
      }

    case types.SVARSED_SAK_DELETE_SUCCESS:
      return {
        ...state,
        deletedSak: (action as ActionWithPayload).payload,
        saks: undefined,
        currentSak: undefined
      }
    case types.SVARSED_SAK_DELETE_FAILURE:
      return {
        ...state,
        deletedSak: null
      }

    case types.SVARSED_SAKS_REQUEST:
    case types.SVARSED_SAKS_REFRESH_REQUEST:
      return {
        ...state,
        saks: undefined,
        deletedSak: undefined
      }

    case types.SVARSED_SAKS_FAILURE:
    case types.SVARSED_SAKS_REFRESH_FAILURE:
      return {
        ...state,
        saks: null
      }

    case types.SVARSED_SAKS_SUCCESS: {
      let saks = _.isArray((action as ActionWithPayload).payload)
        ? (action as ActionWithPayload).payload
        : [(action as ActionWithPayload).payload]

      saks = saks.map((s: Sak) => {
        if (['K', 'M', 'U'].indexOf(s.kjoenn) >= 0) {
          return s
        }
        if (['k', 'm', 'u'].indexOf(s.kjoenn) >= 0) {
          s.kjoenn = s.kjoenn.toUpperCase()
          return s
        }
        if (s.kjoenn === 'f') {
          s.kjoenn = 'K'
          return s
        }
        s.kjoenn = 'U'
        return s
      })

      return {
        ...state,
        saks
      }
    }

    case types.SVARSED_SAKS_REFRESH_SUCCESS: {
      let saks = _.isArray((action as ActionWithPayload).payload)
        ? (action as ActionWithPayload).payload
        : [(action as ActionWithPayload).payload]

      saks = saks.map((s: Sak) => {
        if (['K', 'M', 'U'].indexOf(s.kjoenn) >= 0) {
          return s
        }
        if (['k', 'm', 'u'].indexOf(s.kjoenn) >= 0) {
          s.kjoenn = s.kjoenn.toUpperCase()
          return s
        }
        if (s.kjoenn === 'f') {
          s.kjoenn = 'K'
          return s
        }
        s.kjoenn = 'U'
        return s
      })

      return {
        ...state,
        saks,
        currentSak: saks[0]
      }
    }

    case types.SVARSED_H001SED_CREATE: {
      const sak = (action as ActionWithPayload).payload.sak
      const replySed: H001Sed = {
        sedType: 'H001',
        sedVersjon: '4.2',
        sak,
        sed: {
          sedType: 'H001',
          status: 'new'
        } as Sed,
        bruker: {
          personInfo: {
            fornavn: sak.fornavn,
            etternavn: sak.etternavn,
            kjoenn: sak.kjoenn as Kjoenn,
            foedselsdato: sak.foedselsdato,
            statsborgerskap: [{ land: 'NO' }],
            pin: [{
              land: 'NO',
              identifikator: sak.fnr
            }]
          }
        }
      }

      return {
        ...state,
        replySed
      }
    }

    case types.SVARSED_XSED_CREATE: {
      const sedType = (action as ActionWithPayload).payload.sedType
      const sak = (action as ActionWithPayload).payload.sak
      const replySed: XSed = {
        sedType,
        sak,
        sed: {
          sedType,
          status: 'new'
        } as Sed,
        sedVersjon: '4.2',
        bruker: {
          fornavn: sak?.fornavn ?? '',
          etternavn: sak?.etternavn ?? '',
          kjoenn: sak?.kjoenn as Kjoenn,
          foedselsdato: sak?.foedselsdato ?? '',
          statsborgerskap: [{ land: 'NO' }],
          pin: [{
            land: 'NO',
            identifikator: sak?.fnr
          }]
        }
      }
      return {
        ...state,
        replySed
      }
    }

    case types.SVARSED_SED_INVALIDATE: {
      const { connectedSed, sak } = action.payload
      const replySed: X008Sed = {
        sedType: 'X008',
        sedVersjon: '4.2',
        sak,
        sed: {
          sedType: 'X008',
          status: 'new'
        } as Sed,
        bruker: {
          fornavn: sak?.fornavn ?? '',
          etternavn: sak?.etternavn ?? '',
          kjoenn: (sak?.kjoenn ?? 'U') as Kjoenn,
          foedselsdato: sak?.foedselsdato ?? '',
          statsborgerskap: [{ land: 'NO' }],
          pin: [{
            land: 'NO',
            identifikator: sak?.fnr
          }]
        },
        kansellerSedId: connectedSed.sedType
      } as X008Sed

      return {
        ...state,
        replySed
      }
    }

    case types.SVARSED_SED_REJECT: {
      const { connectedSed, sak } = action.payload
      const replySed: X011Sed = {
        sedType: 'X011',
        sedVersjon: '4.2',
        sak,
        sed: {
          sedType: 'X011',
          status: 'new'
        } as Sed,
        bruker: {
          fornavn: sak?.fornavn ?? '',
          etternavn: sak?.etternavn ?? '',
          kjoenn: (sak?.kjoenn ?? 'U') as Kjoenn,
          foedselsdato: sak?.foedselsdato ?? '',
          statsborgerskap: [{ land: 'NO' }],
          pin: [{
            land: 'NO',
            identifikator: sak?.fnr
          }]
        },
        kansellerSedId: connectedSed.sedType
      } as X011Sed

      return {
        ...state,
        replySed
      }
    }

    case types.SVARSED_SED_CLARIFY: {
      const { sak } = action.payload
      const replySed = {
        sedType: 'X012',
        sedVersjon: '4.2',
        sak,
        sed: {
          sedType: 'X012',
          status: 'new'
        } as Sed,
        bruker: {
          fornavn: sak?.fornavn ?? '',
          etternavn: sak?.etternavn ?? '',
          kjoenn: (sak?.kjoenn ?? 'U') as Kjoenn,
          foedselsdato: sak?.foedselsdato ?? '',
          statsborgerskap: [{ land: 'NO' }],
          pin: [{
            land: 'NO',
            identifikator: sak?.fnr
          }]
        }
      } as X012Sed
      return {
        ...state,
        replySed
      }
    }

    case types.SVARSED_SED_CREATE_SUCCESS: {
      let sed = state.replySed?.sed
      if (_.isNil(sed)) {
        sed = {} as Sed
      }
      sed.sedId = (action as ActionWithPayload).payload.sedId

      standardLogger('svarsed.create.success', { type: (action as ActionWithPayload).context.sedType })
      const newReplySed = {
        ...state.replySed,
        sed
      } as ReplySed
      return {
        ...state,
        // now I can restore sedId to the replySed, so it can be updated later
        replySed: newReplySed,
        originalReplySed: newReplySed,
        sedCreatedResponse: (action as ActionWithPayload).payload,
        replySedChanged: false
      }
    }

    case types.SVARSED_SED_CREATE_FAILURE:
      standardLogger('svarsed.create.failure', { type: (action as ActionWithPayload).context.sedType })
      return {
        ...state,
        sedCreatedResponse: null
      }

    case types.SVARSED_SED_UPDATE_SUCCESS: {
      const sedType = (action as ActionWithPayload).context.sedType
      const sedsThatCanBeResendAfterUpdate = ['H001']
      let sedSendResponse = _.cloneDeep(state.sedSendResponse)
      standardLogger('svarsed.update.success', { type: (action as ActionWithPayload).context.sedType })
      if (sedsThatCanBeResendAfterUpdate.indexOf(sedType) >= 0) {
        // remove the previous send response so we can resend it
        sedSendResponse = undefined
      }

      return {
        ...state,
        sedSendResponse,
        sedCreatedResponse: (action as ActionWithPayload).payload,
        replySedChanged: false
      }
    }

    case types.SVARSED_SED_UPDATE_FAILURE:
      standardLogger('svarsed.update.failure', { type: (action as ActionWithPayload).context.sedType })
      return {
        ...state,
        sedCreatedResponse: null
      }

    case types.SVARSED_SED_CREATE_REQUEST:
      standardLogger('svarsed.create.request')
      return {
        ...state,
        sedCreatedResponse: undefined
      }

    case types.SVARSED_SED_UPDATE_REQUEST:
      standardLogger('svarsed.update.request')
      return {
        ...state,
        sedCreatedResponse: undefined
      }

    case types.SVARSED_SED_STATUS_SUCCESS: {
      const sedId: string = (action as ActionWithPayload).context.sedId
      const newSedStatus = _.cloneDeep(state.sedStatus)
      newSedStatus[sedId] = (action as ActionWithPayload).payload.status
      return {
        ...state,
        sedStatus: newSedStatus
      }
    }

    case types.SVARSED_SED_STATUS_FAILURE: {
      const sedId: string = (action as ActionWithPayload).context.sedId
      const newSedStatus = _.cloneDeep(state.sedStatus)
      newSedStatus[sedId] = null
      return {
        ...state,
        sedStatus: newSedStatus
      }
    }

    case types.SVARSED_SED_STATUS_REQUEST: {
      const sedId: string = (action as ActionWithPayload).context.sedId
      const newSedStatus = _.cloneDeep(state.sedStatus)
      delete newSedStatus[sedId]
      return {
        ...state,
        sedStatus: newSedStatus
      }
    }

    case types.SVARSED_SED_SEND_REQUEST:
      return {
        ...state,
        sedSendResponse: undefined
      }

    case types.SVARSED_SED_SEND_FAILURE:
      return {
        ...state,
        sedSendResponse: null
      }

    case types.SVARSED_SED_SEND_SUCCESS: {
      const newReplySed: ReplySed = _.cloneDeep(state.replySed) as ReplySed
      if (_.isNil(newReplySed.sed)) {
        newReplySed.sed = {} as Sed
      }
      newReplySed.sed.status = 'sent'
      return {
        ...state,
        replySed: newReplySed,
        sedSendResponse: { success: true }
      }
    }

    case types.SVARSED_REPLYSED_LOAD:
      return {
        ...state,
        replySed: (action as ActionWithPayload).payload,
        originalReplySed: (action as ActionWithPayload).payload,
        replySedChanged: false
      }

    case types.SVARSED_REPLYSED_SET:
      return {
        ...state,
        replySed: (action as ActionWithPayload).payload,
        replySedChanged: true
      }

    case types.SVARSED_REPLYSED_RESTORE:
      return {
        ...state,
        replySed: state.originalReplySed
      }

    case types.SVARSED_REPLYSED_UPDATE: {
      let newReplySed: ReplySed | null | undefined = _.cloneDeep(state.replySed)
      if (!newReplySed) {
        newReplySed = {} as ReplySed
      }
      _.set(newReplySed,
        (action as ActionWithPayload).payload.needle,
        (action as ActionWithPayload).payload.value
      )

      return {
        ...state,
        replySed: newReplySed,
        replySedChanged: true
      }
    }

    default:
      return state
  }
}

export default svarsedReducer
