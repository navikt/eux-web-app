import * as types from 'constants/actionTypes'
import { ReplySed } from 'declarations/sed.d'
import { CreateSedResponse, FagSaker, Seds } from 'declarations/types.d'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Action } from 'redux'

export interface SvarsedState {
  fagsaker: FagSaker | null | undefined
  parentSed: string | undefined
  personRelatert: any
  previewFile: any
  previousParentSed: string | undefined
  replySed: ReplySed | null | undefined
  seds: Seds | null | undefined
  sedCreatedResponse: CreateSedResponse | null | undefined
  sedSendResponse: any | null | undefined
  sedStatus: {[k in string]: string | null}
}

export const initialSvarsedState: SvarsedState = {
  fagsaker: undefined,
  parentSed: undefined,
  personRelatert: undefined,
  previewFile: undefined,
  previousParentSed: undefined,
  replySed: undefined,
  seds: undefined,
  sedCreatedResponse: undefined,
  sedSendResponse: undefined,
  sedStatus: {}
}

const svarsedReducer = (
  state: SvarsedState = initialSvarsedState,
  action: Action | ActionWithPayload = { type: '', payload: undefined }
): SvarsedState => {
  switch (action.type) {
    case types.APP_CLEAN:
      return initialSvarsedState

    case types.SVARSED_FAGSAKER_RESET:
    case types.SVARSED_FAGSAKER_GET_REQUEST:
      return {
        ...state,
        fagsaker: undefined
      }

    case types.SVARSED_FAGSAKER_GET_SUCCESS:
      return {
        ...state,
        fagsaker: (action as ActionWithPayload).payload
      }

    case types.SVARSED_FAGSAKER_GET_FAILURE:
      return {
        ...state,
        fagsaker: null
      }

    case types.SVARSED_REPLYTOSED_REQUEST:
      return {
        ...state,
        sedCreatedResponse: undefined,
        sedSendResponse: undefined
      }

    case types.SVARSED_REPLYTOSED_SUCCESS:
      return {
        ...state,
        replySed: {
          ...(action as ActionWithPayload).payload,
          saksnummer: (action as ActionWithPayload).context.saksnummer,
          sakUrl: (action as ActionWithPayload).context.sakUrl,
          sedId: undefined, // so we can signal this SED as a SED that needs to be created, not updated
          status: (action as ActionWithPayload).context.status
        }
      }

    case types.SVARSED_REPLYTOSED_FAILURE:
      return {
        ...state,
        replySed: null
      }

    case types.SVARSED_EDIT_REQUEST:
      return {
        ...state,
        sedCreatedResponse: undefined,
        sedSendResponse: undefined
      }

    case types.SVARSED_EDIT_SUCCESS:
      return {
        ...state,
        replySed: {
          ...(action as ActionWithPayload).payload,
          saksnummer: (action as ActionWithPayload).context.saksnummer,
          sedId: (action as ActionWithPayload).context.sedId,
          status: (action as ActionWithPayload).context.status
        }
      }

    case types.SVARSED_EDIT_FAILURE:
      return {
        ...state,
        replySed: null
      }

    case types.SVARSED_PREVIEW_SUCCESS:
      return {
        ...state,
        previewFile: (action as ActionWithPayload).payload
      }

    case types.SVARSED_PREVIEW_FAILURE:
      return {
        ...state,
        previewFile: null
      }

    case types.SVARSED_PREVIEW_REQUEST:
    case types.SVARSED_PREVIEW_RESET:
      return {
        ...state,
        previewFile: undefined
      }

    case types.SVARSED_SAKSNUMMERORFNR_QUERY_REQUEST:
      return {
        ...state,
        seds: undefined
      }

    case types.SVARSED_SAKSNUMMERORFNR_QUERY_FAILURE:
      return {
        ...state,
        seds: null
      }

    case types.SVARSED_SAKSNUMMERORFNR_QUERY_SUCCESS: {
      const seds = _.isArray((action as ActionWithPayload).payload)
        ? (action as ActionWithPayload).payload
        : [(action as ActionWithPayload).payload]
      return {
        ...state,
        seds: seds
      }
    }

    case types.SVARSED_SED_CREATE_SUCCESS:
      standardLogger('svarsed.create.success', { type: (action as ActionWithPayload).context.sedType })
      return {
        ...state,
        sedCreatedResponse: (action as ActionWithPayload).payload
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
        sedSendResponse: sedSendResponse,
        sedCreatedResponse: (action as ActionWithPayload).payload
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
      const newReplySed = _.cloneDeep(state.replySed)
      newReplySed!.status = 'sent'
      return {
        ...state,
        replySed: newReplySed,
        sedSendResponse: { success: true }
      }
    }

    case types.SVARSED_PARENTSED_SET:
      return {
        ...state,
        previousParentSed: state.parentSed,
        parentSed: (action as ActionWithPayload).payload
      }

    case types.SVARSED_REPLYSED_SET:
      return {
        ...state,
        replySed: (action as ActionWithPayload).payload
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
        replySed: newReplySed
      }
    }

    default:
      return state
  }
}

export default svarsedReducer
