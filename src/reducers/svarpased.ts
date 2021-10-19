import * as types from 'constants/actionTypes'
import { SvarPaSedMode } from 'declarations/app'
import { ReplySed } from 'declarations/sed.d'
import { CreateSedResponse, FagSaker, Seds } from 'declarations/types.d'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Action } from 'redux'

export interface SvarpasedState {
  fagsaker: FagSaker | null | undefined
  mode: SvarPaSedMode
  parentSed: string | undefined
  personRelatert: any
  previewFile: any
  previousParentSed: string | undefined
  replySed: ReplySed | null | undefined
  seds: Seds | undefined
  sedCreatedResponse: CreateSedResponse | null | undefined
  sedSendResponse: any | null | undefined
  sedStatus: {[k in string]: string | null}
}

export const initialSvarpasedState: SvarpasedState = {
  fagsaker: undefined,
  mode: 'selection' as SvarPaSedMode,
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

const svarpasedReducer = (
  state: SvarpasedState = initialSvarpasedState,
  action: Action | ActionWithPayload = { type: '', payload: undefined }
): SvarpasedState => {
  switch (action.type) {
    case types.SVARPASED_FAGSAKER_RESET:
    case types.SVARPASED_FAGSAKER_GET_REQUEST:
      return {
        ...state,
        fagsaker: undefined
      }

    case types.SVARPASED_FAGSAKER_GET_SUCCESS:
      return {
        ...state,
        fagsaker: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_FAGSAKER_GET_FAILURE:
      return {
        ...state,
        fagsaker: null
      }

    case types.SVARPASED_MODE_SET:
      return {
        ...state,
        mode: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_REPLYSED_QUERY_REQUEST:
      return {
        ...state,
        sedCreatedResponse: undefined,
        sedSendResponse: undefined
      }

    case types.SVARPASED_REPLYSED_QUERY_SUCCESS:
      return {
        ...state,
        replySed: {
          ...(action as ActionWithPayload).payload,
          saksnummer: (action as ActionWithPayload).context.saksnummer,
          sedUrl: (action as ActionWithPayload).context.sedUrl,
          sedId: (action as ActionWithPayload).context.sedId
        }
      }

    case types.SVARPASED_REPLYSED_QUERY_FAILURE:
      return {
        ...state,
        replySed: null
      }

    case types.SVARPASED_PREVIEW_SUCCESS:
      return {
        ...state,
        previewFile: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_PREVIEW_FAILURE:
      return {
        ...state,
        previewFile: null
      }

    case types.SVARPASED_PREVIEW_REQUEST:
    case types.SVARPASED_PREVIEW_RESET:
      return {
        ...state,
        previewFile: undefined
      }

    case types.SVARPASED_SAKSNUMMERORFNR_QUERY_REQUEST:
      return {
        ...state,
        seds: undefined
      }

    case types.SVARPASED_SAKSNUMMERORFNR_QUERY_SUCCESS: {
      const seds = _.isArray((action as ActionWithPayload).payload)
        ? (action as ActionWithPayload).payload
        : [(action as ActionWithPayload).payload]
      return {
        ...state,
        seds: seds
      }
    }

    case types.SVARPASED_SED_CREATE_SUCCESS:

      standardLogger('svarsed.create.success')
      return {
        ...state,
        sedCreatedResponse: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_SED_CREATE_FAILURE:
      standardLogger('svarsed.create.failure')
      return {
        ...state,
        sedCreatedResponse: null
      }

    case types.SVARPASED_SED_CREATE_REQUEST:
      standardLogger('svarsed.create.request')
      return {
        ...state,
        sedCreatedResponse: undefined
      }

    case types.SVARPASED_SED_STATUS_SUCCESS: {
      const sedId: string = (action as ActionWithPayload).context.sedId
      let newSedStatus = _.cloneDeep(state.sedStatus)
      newSedStatus[sedId] = (action as ActionWithPayload).payload.status
      return {
        ...state,
        sedStatus: newSedStatus
      }
    }

    case types.SVARPASED_SED_STATUS_FAILURE: {
      const sedId: string = (action as ActionWithPayload).context.sedId
      let newSedStatus = _.cloneDeep(state.sedStatus)
      newSedStatus[sedId] = null
      return {
        ...state,
        sedStatus: newSedStatus
      }
    }

    case types.SVARPASED_SED_STATUS_REQUEST: {
      const sedId: string = (action as ActionWithPayload).context.sedId
      let newSedStatus = _.cloneDeep(state.sedStatus)
      delete newSedStatus[sedId]
      return {
        ...state,
        sedStatus: newSedStatus
      }
    }

    case types.SVARPASED_SED_SEND_REQUEST:
      return {
        ...state,
        sedSendResponse: undefined
      }

    case types.SVARPASED_SED_SEND_FAILURE:
      return {
        ...state,
        sedSendResponse: null
      }

    case types.SVARPASED_SED_SEND_REQUEST:
      return {
        ...state,
        sedSendResponse: undefined
      }




    case types.SVARPASED_PARENTSED_SET:
      return {
        ...state,
        previousParentSed: state.parentSed,
        parentSed: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_REPLYSED_SET:
      return {
        ...state,
        replySed: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_REPLYSED_RESET:
      return {
        ...state,
        replySed: undefined
      }

    case types.SVARPASED_REPLYSED_UPDATE: {
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

    case types.APP_CLEAN_DATA:

      // keep seds, they are for the sed dropdown options
      return {
        ...initialSvarpasedState,
        seds: state.seds,
        previousParentSed: state.previousParentSed,
        parentSed: state.parentSed,
        replySed: state.replySed
      }

    default:
      return state
  }
}

export default svarpasedReducer
