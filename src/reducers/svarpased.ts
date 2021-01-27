import { Arbeidsforhold, Inntekter, SvarSed, SvarPaSedOversikt, Person, SedOversikt } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'
import { Action } from 'redux'
import * as types from 'constants/actionTypes'
import _ from 'lodash'

export interface SvarpasedState {
  arbeidsforholdList: Arbeidsforhold
  familierelasjoner: Array<any>
  person: Person | null | undefined
  personRelatert: any
  spørreSed: string | undefined
  svarSed: SvarSed | undefined
  svarPaSedOversikt: SvarPaSedOversikt | undefined
  svarPasedData: { sedId: string } | null | undefined
  valgteArbeidsforhold: Arbeidsforhold
  valgtSvarSed: SedOversikt | undefined
  inntekter: Inntekter | undefined
  selectedInntekter: Inntekter | undefined
}

export const initialSvarpasedState: SvarpasedState = {
  arbeidsforholdList: [],
  spørreSed: undefined,
  svarSed: undefined,
  svarPaSedOversikt: undefined,
  person: undefined,
  personRelatert: undefined,
  familierelasjoner: [],
  svarPasedData: undefined,
  valgteArbeidsforhold: [],
  valgtSvarSed: undefined,
  inntekter: undefined,
  selectedInntekter: undefined
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

    case types.SVARPASED_OVERSIKT_GET_SUCCESS:
      return {
        ...state,
        svarPaSedOversikt: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_OVERSIKT_GET_FAILURE:
      return {
        ...state,
        svarPaSedOversikt: null
      }

    case types.SVARPASED_SVARSED_QUERY_SUCCESS:
      return {
        ...state,
        svarSed: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_SVARSED_QUERY_FAILURE:
      return {
        ...state,
        svarSed: null
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

    case types.SVARPASED_SPØRRESED_SET:
      return {
        ...state,
        spørreSed: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_SVARSED_SET:
      return {
        ...state,
        valgtSvarSed: (action as ActionWithPayload).payload
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
        svarPaSedOversikt: state.svarPaSedOversikt,
        spørreSed: state.spørreSed,
        svarSed: state.svarSed,
        valgtSvarSed: state.valgtSvarSed,
        person: state.person
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
