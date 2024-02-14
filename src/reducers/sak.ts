import { ActionWithPayload } from '@navikt/fetch'
import * as types from 'constants/actionTypes'
import { FillOutInfoPayload } from 'declarations/sed'
import {ArbeidsperiodeFraAA, Fagsak, Fagsaker, Institusjon, OldFamilieRelasjon, OpprettetSak} from 'declarations/types'
import _ from 'lodash'
import { AnyAction } from 'redux'

export interface SakState {
  arbeidsperioder: Array<ArbeidsperiodeFraAA>
  buctype: any
  familierelasjoner: Array<OldFamilieRelasjon>
  fagsaker: Fagsaker | undefined | null
  fnr: string | undefined
  institusjon: string | undefined
  institusjonList: Array<Institusjon> | undefined
  landkode: string | undefined
  opprettetSak: OpprettetSak | undefined
  filloutinfo: any | null | undefined
  personRelatert: OldFamilieRelasjon | null | undefined
  saksId: any
  sektor: any
  sedtype: any
  tema: any
  unit: any
}

export const initialSakState: SakState = {
  arbeidsperioder: [],
  buctype: undefined,
  fagsaker: undefined,
  familierelasjoner: [],
  fnr: undefined,
  institusjonList: undefined,
  institusjon: undefined,
  landkode: undefined,
  opprettetSak: undefined,
  filloutinfo: undefined,
  personRelatert: undefined,
  saksId: undefined,
  sedtype: undefined,
  sektor: undefined,
  tema: undefined,
  unit: undefined
}

const sakReducer = (state: SakState = initialSakState, action: AnyAction): SakState => {
  switch (action.type) {
    case types.APP_RESET:
    case types.SAK_RESET:
      return initialSakState

    case types.SAK_FAGSAKER_RESET:
    case types.SAK_FAGSAKER_REQUEST:
      return {
        ...state,
        fagsaker: undefined
      }

    case types.SAK_FAGSAKER_SUCCESS:
      return {
        ...state,
        fagsaker: (action as ActionWithPayload).payload
      }

    case types.SAK_FAGSAKER_FAILURE:
      return {
        ...state,
        fagsaker: null
      }

    case types.SAK_CREATE_FAGSAK_GENERELL_REQUEST:
    case types.SAK_CREATE_FAGSAK_DAGPENGER_REQUEST:
      return {
        ...state,
        saksId: undefined
      }

    case types.SAK_CREATE_FAGSAK_GENERELL_SUCCESS:
      return {
        ...state,
        fagsaker: [(action as ActionWithPayload).payload],
        saksId: (action as ActionWithPayload).payload.id
      }

    case types.SAK_CREATE_FAGSAK_DAGPENGER_SUCCESS:
      const fagsak:Fagsak = (action as ActionWithPayload).payload
      let fSaker = _.cloneDeep(state.fagsaker)
      fSaker?.unshift(fagsak)

      return {
        ...state,
        fagsaker: fSaker,
        saksId: fagsak.id
      }

    case types.SAK_CREATE_FAGSAK_GENERELL_FAILURE:
    case types.SAK_CREATE_FAGSAK_DAGPENGER_FAILURE:
      return {
        ...state,
        fagsaker: null,
        saksId: null
      }


    case types.SAK_INSTITUSJONER_SUCCESS:
      return {
        ...state,
        institusjonList: (action as ActionWithPayload).payload
      }

    case types.SAK_LANDKODER_SUCCESS:
      return {
        ...state,
        landkode: (action as ActionWithPayload).payload
      }

    case types.SAK_FILLOUTINFO_RESET:
    case types.SAK_FILLOUTINFO_REQUEST:
      return {
        ...state,
        filloutinfo: undefined
      }

    case types.SAK_FILLOUTINFO_FAILURE:
      return {
        ...state,
        filloutinfo: null
      }

    case types.SAK_FILLOUTINFO_SUCCESS: {
      const fillOutInfoPayload: FillOutInfoPayload = (action as ActionWithPayload).payload
      const template = (action as ActionWithPayload).context.template
      const norwegianPin = fillOutInfoPayload.bruker.personInfo.pin.filter((p) => (p.land === 'NO'))
      return {
        ...state,
        filloutinfo: {
          ...template,
          ...fillOutInfoPayload,
          sak: {
            ...template.sak,
            fornavn: fillOutInfoPayload.bruker.personInfo.fornavn,
            etternavn: fillOutInfoPayload.bruker.personInfo.etternavn,
            foedselsdato: fillOutInfoPayload.bruker.personInfo.foedselsdato,
            kjoenn: fillOutInfoPayload.bruker.personInfo.kjoenn,
            fnr: norwegianPin && norwegianPin.length === 1 ? norwegianPin[0].identifikator : undefined
          }
        }
      }
    }

    case types.SAK_SEND_RESET:
      return {
        ...state,
        opprettetSak: undefined
      }

    case types.SAK_SEND_SUCCESS:
      return {
        ...state,
        opprettetSak: (action as ActionWithPayload).payload
      }

    case types.SAK_PROPERTY_SET:
      return {
        ...state,
        [(action as ActionWithPayload).payload.key]: (action as ActionWithPayload).payload.value
      }

    case types.SAK_ARBEIDSPERIODER_ADD:
      return {
        ...state,
        arbeidsperioder: (state.arbeidsperioder || []).concat((action as ActionWithPayload).payload)
      }

    case types.SAK_ARBEIDSPERIODER_REMOVE:
      return {
        ...state,
        arbeidsperioder: _.reject(state.arbeidsperioder, i => _.isEqual(i, (action as ActionWithPayload).payload))
      }

    case types.SAK_FAMILIERELASJONER_ADD:
      return {
        ...state,
        familierelasjoner: (state.familierelasjoner || []).concat((action as ActionWithPayload).payload)
      }

    case types.SAK_FAMILIERELASJONER_REMOVE:
      return {
        ...state,
        familierelasjoner: _.reject(state.familierelasjoner, i => i.fnr === (action as ActionWithPayload).payload.fnr)
      }

    default:

      return state
  }
}

export default sakReducer
