import * as types from 'constants/actionTypes'
import { Arbeidsgiver, ReplySed } from 'declarations/sed.d'
import { Arbeidsperioder, IInntekter, Person, Seds, Validation } from 'declarations/types.d'
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
  searchedPerson: Person | undefined
  selectedInntekter: IInntekter | undefined
  seds: Seds | undefined
  sedCreatedResponse: any
  valgteArbeidsgivere: Array<Arbeidsgiver>,
  validation: Validation
}

export const initialSvarpasedState: SvarpasedState = {
  arbeidsperioder: undefined,
  familierelasjoner: [],
  inntekter: undefined,
  parentSed: undefined,
  personRelatert: undefined,
  previewFile: undefined,
  previousParentSed: undefined,
  previousReplySed: undefined,
  replySed: undefined,
  searchedPerson: undefined,
  seds: undefined,
  saksnummerOrFnr: undefined,
  selectedInntekter: undefined,
  sedCreatedResponse: undefined,
  valgteArbeidsgivere: [],
  validation: {}
}

const svarpasedReducer = (
  state: SvarpasedState = initialSvarpasedState,
  action: Action | ActionWithPayload = { type: '', payload: undefined }
) => {
  switch (action.type) {
    case types.SVARPASED_ARBEIDSPERIODER_GET_SUCCESS:
      return {
        ...state,
        arbeidsperioder: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_ARBEIDSGIVER_ADD:
      return {
        ...state,
        valgteArbeidsgivere: state.valgteArbeidsgivere.concat(
          (action as ActionWithPayload).payload
        )
      }

    case types.SVARPASED_ARBEIDSGIVER_REMOVE:
      return {
        ...state,
        valgteArbeidsgivere: _.filter(
          state.valgteArbeidsgivere,
          (i) => i !== (action as ActionWithPayload).payload
        )
      }

    case types.SVARPASED_REPLYSED_QUERY_SUCCESS:
      return {
        ...state,
        previousReplySed: state.replySed,
        replySed: {
          ...(action as ActionWithPayload).payload,
          saksnummer: (action as ActionWithPayload).context.saksnummer,
        }
      }

    case types.SVARPASED_REPLYSED_QUERY_FAILURE:
      return {
        ...state,
        previousReplySed: state.replySed,
        replySed: null
      }

    case types.SVARPASED_PERSON_SEARCH_REQUEST:
      return {
        ...state,
        searchedPerson: undefined
      }

    case types.SVARPASED_PERSON_SEARCH_SUCCESS:
      return {
        ...state,
        searchedPerson: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_PERSON_SEARCH_FAILURE:
      return {
        ...state,
        searchedPerson: null
      }

    case types.SVARPASED_PERSON_RELATERT_GET_FAILURE:
      return {
        ...state,
        personRelatert: null
      }

    case types.SVARPASED_PERSON_RELATERT_GET_SUCCESS:
      return {
        ...state,
        personRelatert: (action as ActionWithPayload).payload
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

    case types.SVARPASED_FAMILIERELASJONER_ADD:
      return {
        ...state,
        familierelasjoner: state.familierelasjoner.concat(
          (action as ActionWithPayload).payload
        )
      }

    case types.SVARPASED_FAMILIERELASJONER_REMOVE:
      return {
        ...state,
        familierelasjoner: _.filter(
          state.familierelasjoner,
          (i) => i.fnr !== (action as ActionWithPayload).payload.fnr
        )
      }

    case types.SVARPASED_INNTEKT_GET_SUCCESS:
      return {
        ...state,
        inntekter: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_SELECTED_INNTEKT_SUCCESS:
      return {
        ...state,
        selectedInntekter: (action as ActionWithPayload).payload
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

    case types.SVARPASED_PERSON_RELATERT_RESET:
      return {
        ...state,
        personRelatert: undefined
      }

    case types.SVARPASED_VALIDATION_ALL_SET:
      return {
        ...state,
        validation: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_VALIDATION_SET: {
      const { key, value } = (action as ActionWithPayload).payload
      if (!key) {
        return {
          ...state,
          validation: {}
        }
      }
      return {
        ...state,
        validation: {
          ...state.validation,
          [key]: value
        }
      }
    }

    default:
      return state
  }
}

export default svarpasedReducer
