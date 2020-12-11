import { Arbeidsforhold, Inntekter, ReplySed } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'
import { Action } from 'redux'
import * as types from 'constants/actionTypes'
import _ from 'lodash'

export interface SvarpasedState {
  arbeidsforholdList: Arbeidsforhold
  familierelasjoner: Array<any>
  inntekter: Inntekter | undefined
  parentSed: string | undefined
  person: any
  personRelatert: any
  previousParentSed: string | undefined
  replySed: ReplySed | undefined
  saksnummerOrFnr: string | undefined
  selectedInntekter: Inntekter | undefined
  svarPasedData: any
  valgteArbeidsforhold: Arbeidsforhold
}

export const initialSvarpasedState: SvarpasedState = {
  arbeidsforholdList: [],
  familierelasjoner: [],
  inntekter: undefined,
  parentSed: undefined,
  person: undefined,
  personRelatert: undefined,
  previousParentSed: undefined,
  replySed: undefined,
  saksnummerOrFnr: undefined,
  selectedInntekter: undefined,
  svarPasedData: undefined,
  valgteArbeidsforhold: []
}

const svarpasedReducer = (
  state: SvarpasedState = initialSvarpasedState,
  action: Action | ActionWithPayload = { type: '', payload: undefined }
) => {
  switch (action.type) {
    case types.SVARPASED_ARBEIDSFORHOLDLIST_GET_SUCCESS:
      return {
        ...state,
        arbeidsforholdList: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_ARBEIDSFORHOLD_ADD:
      return {
        ...state,
        valgteArbeidsforhold: state.valgteArbeidsforhold.concat(
          (action as ActionWithPayload).payload
        )
      }

    case types.SVARPASED_ARBEIDSFORHOLD_REMOVE:
      return {
        ...state,
        valgteArbeidsforhold: _.filter(
          state.valgteArbeidsforhold,
          (i) => i !== (action as ActionWithPayload).payload
        )
      }

    case types.SVARPASED_REPLYSED_QUERY_SUCCESS:
      return {
        ...state,
        replySed: {
          ...(action as ActionWithPayload).context.connectedSed,
          ...(action as ActionWithPayload).payload
        }
      }

    case types.SVARPASED_REPLYSED_QUERY_FAILURE:
      return {
        ...state,
        replySed: null
      }

    case types.SVARPASED_PERSON_GET_FAILURE:
      return {
        ...state,
        person: null
      }

    case types.SVARPASED_PERSON_GET_SUCCESS:
      return {
        ...state,
        person: (action as ActionWithPayload).payload
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

    case types.SVARPASED_SAKSNUMMERORFNR_QUERY_SUCCESS:
      return {
        ...state,
        seds: (action as ActionWithPayload).payload,
        saksnummerOrFnr: (action as ActionWithPayload).context.saksnummerOrFnr
      }

    case types.SVARPASED_SENDSVARPASEDDATA_POST_SUCCESS:
      return {
        ...state,
        svarPasedData: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_SENDSVARPASEDDATA_POST_FAILURE:
      return {
        ...state,
        svarPasedData: null
      }

    case types.SVARPASED_PARENTSED_SET:
      return {
        ...state,
        previousParentSed: state.parentSed,
        parentSed: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_REPLYSED_RESET:
      return {
        ...state,
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
        replySed: state.replySed
      }

    case types.SVARPASED_PERSON_RESET:
      return {
        ...state,
        person: null
      }

    case types.SVARPASED_PERSON_RELATERT_RESET:
      return {
        ...state,
        personRelatert: undefined
      }

    default:
      return state
  }
}

export default svarpasedReducer
