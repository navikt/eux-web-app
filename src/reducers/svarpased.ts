import * as types from 'constants/actionTypes'
import { ReplySed } from 'declarations/sed.d'
import { Arbeidsperioder, IInntekter, Seds, Validation } from 'declarations/types.d'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'

export interface SvarpasedState {
  arbeidsperioder: Arbeidsperioder | undefined
  familierelasjoner: Array<any>
  inntekter: IInntekter | undefined
  parentSed: string | undefined
  personRelatert: any
  previewFile: any
  previousParentSed: string | undefined
  previousReplySed: ReplySed | undefined
  replySed: ReplySed | undefined
  saksnummerOrFnr: string | undefined
  seds: Seds | undefined
  sedCreatedResponse: any

  validation: Validation
}

export const initialSvarpasedState: SvarpasedState = {
  parentSed: undefined,
  personRelatert: undefined,
  previewFile: undefined,
  previousParentSed: undefined,
  previousReplySed: undefined,
  replySed: undefined,
  seds: undefined,
  saksnummerOrFnr: undefined,
  sedCreatedResponse: undefined
}

const svarpasedReducer = (
  state: SvarpasedState = initialSvarpasedState,
  action: Action | ActionWithPayload = { type: '', payload: undefined }
) => {
  switch (action.type) {


    case types.SVARPASED_REPLYSED_QUERY_SUCCESS:
      return {
        ...state,
        previousReplySed: state.replySed,
        replySed: {
          ...(action as ActionWithPayload).payload,
          saksnummer: (action as ActionWithPayload).context.saksnummer
        }
      }

    case types.SVARPASED_REPLYSED_QUERY_FAILURE:
      return {
        ...state,
        previousReplySed: state.replySed,
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
        seds: seds,
        saksnummerOrFnr: (action as ActionWithPayload).context.saksnummerOrFnr
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
        previousReplySed: state.replySed,
        replySed: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_REPLYSED_RESET:
      return {
        ...state,
        previousReplySed: state.replySed,
        replySed: undefined
      }


    case types.SVARPASED_REPLYSED_UPDATE: {

      let newReplySed: ReplySed | undefined = _.cloneDeep(state.replySed)
      if (!newReplySed) {
        newReplySed = {} as ReplySed
      }
      _.set(newReplySed,
        (action as ActionWithPayload).payload.needleString,
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
        previousReplySed: state.previousReplySed,
        replySed: state.replySed
      }

    case types.PERSON_RELATERT_RESET:
      return {
        ...state,
        personRelatert: undefined
      }

    default:
      return state
  }
}

export default svarpasedReducer
