import * as types from 'constants/actionTypes'
import { SvarPaSedMode } from 'declarations/app'
import { ReplySed } from 'declarations/sed.d'
import { Seds } from 'declarations/types.d'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'

export interface SvarpasedState {
  mode: SvarPaSedMode
  parentSed: string | undefined
  personRelatert: any
  previewFile: any
  previousParentSed: string | undefined
  replySed: ReplySed | undefined
  seds: Seds | undefined
  sedCreatedResponse: any
}

export const initialSvarpasedState: SvarpasedState = {
  mode: 'selection' as SvarPaSedMode,
  parentSed: undefined,
  personRelatert: undefined,
  previewFile: undefined,
  previousParentSed: undefined,
  replySed: undefined,
  seds: undefined,
  sedCreatedResponse: undefined
}

const svarpasedReducer = async (
  state: SvarpasedState = initialSvarpasedState,
  action: Action | ActionWithPayload = { type: '', payload: undefined }
) => {
  switch (action.type) {
    case types.SVARPASED_MODE_SET:
      return {
        ...state,
        mode: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_REPLYSED_QUERY_SUCCESS:
      return {
        ...state,
        replySed: {
          ...(action as ActionWithPayload).payload,
          saksnummer: (action as ActionWithPayload).context.saksnummer,
          sedUrl: (action as ActionWithPayload).context.sedUrl
        }
      }

    case types.SVARPASED_REPLYSED_QUERY_FAILURE:
      return {
        ...state,
        replySed: null
      }

    case types.SVARPASED_PREVIEW_SUCCESS: {

      const blobToBase64 = (blob: Blob) => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        return new Promise(resolve => {
          reader.onloadend = () => {
            resolve(reader.result)
          }
        })
      }

      let base64 = await blobToBase64((action as ActionWithPayload).payload)
      return {
        ...state,
        previewFile: {
          id: new Date().getTime(),
          size: (action as ActionWithPayload).payload.size,
          name: '',
          mimetype: (action as ActionWithPayload).payload.type,
          content: {
            base64: base64
          }
        }
      }
    }

    case types.SVARPASED_PREVIEW_FAILURE:
      return {
        ...state,
        previewFile: null
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
      return {
        ...state,
        sedCreatedResponse: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_SED_CREATE_FAILURE:
      return {
        ...state,
        sedCreatedResponse: null
      }

    case types.SVARPASED_SED_RESPONSE_RESET:
      return {
        ...state,
        sedCreatedResponse: undefined
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
      let newReplySed: ReplySed | undefined = _.cloneDeep(state.replySed)
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
