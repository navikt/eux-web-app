import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import * as types from 'constants/actionTypes'
import {
  Arbeidsgiver,
  Arbeidsperioder,
  FagSaker,
  OldFamilieRelasjon,
  Institusjon,
  OpprettetSak,
  Person
} from 'declarations/types'

export interface SakState {
  arbeidsperioder: Arbeidsperioder | undefined
  arbeidsgivere: Array<Arbeidsgiver>
  buctype: any
  familierelasjoner: Array<OldFamilieRelasjon>
  fagsaker: FagSaker | undefined | null
  fnr: string | undefined
  institusjon: string | undefined
  institusjonList: Array<Institusjon> | undefined
  landkode: string | undefined
  opprettetSak: OpprettetSak | undefined
  person: Person | undefined
  personRelatert: OldFamilieRelasjon | undefined
  saksId: any
  sektor: any
  sedtype: any
  tema: any
  unit: any
}

export const initialSakState: SakState = {
  arbeidsperioder: undefined,
  arbeidsgivere: [],
  buctype: undefined,
  fagsaker: undefined,
  familierelasjoner: [],
  fnr: undefined,
  institusjonList: undefined,
  institusjon: undefined,
  landkode: undefined,
  opprettetSak: undefined,
  person: undefined,
  personRelatert: undefined,
  saksId: undefined,
  sedtype: undefined,
  sektor: undefined,
  tema: undefined,
  unit: undefined
}

const sakReducer = (state: SakState = initialSakState, action: ActionWithPayload = { type: '', payload: undefined }) => {
  switch (action.type) {
    case types.SAK_ARBEIDSPERIODER_GET_SUCCESS:
      return {
        ...state,
        arbeidsperioder: action.payload
      }

    case types.SAK_FAGSAKER_GET_REQUEST:
      return {
        ...state,
        fagsaker: undefined
      }

    case types.SAK_FAGSAKER_GET_SUCCESS:
      return {
        ...state,
        fagsaker: action.payload
      }

    case types.SAK_FAGSAKER_GET_FAILURE:
      return {
        ...state,
        fagsaker: null
      }

    case types.SAK_FAGSAKER_RESET:
      return {
        ...state,
        fagsaker: undefined
      }

    case types.SAK_INSTITUSJONER_GET_SUCCESS:
      return {
        ...state,
        institusjonList: action.payload
      }

    case types.SAK_LANDKODER_GET_SUCCESS:
      return {
        ...state,
        landkoder: action.payload
      }

    case types.SAK_PERSON_GET_FAILURE:
      return {
        ...state,
        person: null
      }

    case types.SAK_PERSON_GET_SUCCESS:
      return {
        ...state,
        person: action.payload
      }

    case types.SAK_PERSON_RELATERT_GET_FAILURE:
      return {
        ...state,
        personRelatert: null
      }

    case types.SAK_PERSON_RELATERT_GET_SUCCESS:
      return {
        ...state,
        personRelatert: action.payload
      }

    case types.SAK_PERSON_RESET:
      return {
        ...state,
        person: undefined
      }

    case types.SAK_PERSON_RELATERT_RESET:
      return {
        ...state,
        personRelatert: undefined
      }

    case types.SAK_SEND_SUCCESS:
      return {
        ...state,
        opprettetSak: action.payload,
        // do an app reset
        arbeidsgivere: [],
        buctype: undefined,
        fagsaker: undefined,
        familierelasjoner: [],
        institusjonList: undefined,
        institusjon: undefined,
        landkode: undefined,
        person: undefined,
        personRelatert: undefined,
        saksId: undefined,
        sedtype: undefined,
        sektor: undefined,
        tema: undefined,
        unit: undefined,
        fnr: undefined
      }

    case types.SAK_CLEAN_DATA:
      return {
        ...state,
        opprettetSak: undefined
      }

    case types.APP_CLEAN_DATA:
      // reset all but stuff that comes from eessi-kodeverk
      return {
        ...state,
        arbeidsgivere: [],
        buctype: undefined,
        fagsaker: undefined,
        familierelasjoner: [],
        institusjonList: undefined,
        institusjon: undefined,
        landkode: undefined,
        person: undefined,
        personRelatert: undefined,
        saksId: undefined,
        sedtype: undefined,
        sektor: undefined,
        tema: undefined,
        unit: undefined
      }

    case types.SAK_PROPERTY_SET:
      return {
        ...state,
        [(action as ActionWithPayload).payload.key]: (action as ActionWithPayload).payload.value
      }

    case types.SAK_ARBEIDSGIVER_ADD:
      return {
        ...state,
        arbeidsgivere: (state.arbeidsgivere || []).concat((action as ActionWithPayload).payload)
      }

    case types.SAK_ARBEIDSGIVER_REMOVE:
      return {
        ...state,
        arbeidsgivere: _.filter(state.arbeidsgivere, i => i !== (action as ActionWithPayload).payload)
      }

    case types.SAK_FAMILIERELASJONER_ADD:
      return {
        ...state,
        familierelasjoner: (state.familierelasjoner || []).concat((action as ActionWithPayload).payload)
      }

    case types.SAK_FAMILIERELASJONER_REMOVE:
      return {
        ...state,
        familierelasjoner: _.filter(state.familierelasjoner, i => i.fnr !== (action as ActionWithPayload).payload.fnr)
      }

    default:

      return state
  }
}

export default sakReducer
