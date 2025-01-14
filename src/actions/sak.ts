import { ParamPayload } from 'declarations/app'
import {
  ArbeidsperiodeFraAA,
  Fagsaker,
  OldFamilieRelasjon,
  Institusjoner,
  Kodeverk, OpprettetSak
} from 'declarations/types'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockSendSak from 'mocks/sak/sendSak'
import mockFagsakerList from 'mocks/fagsakerList'
import { mockInstitusjon } from 'mocks/institutionList'
import mockReplySed from 'mocks/svarsed/replySed'
import moment from 'moment'
import { Action, ActionCreator } from 'redux'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import mockFagsakGenerell from "../mocks/fagsak_generell";
import {FagsakPayload} from "../declarations/pd";
import mockFagsakDagpenger from "../mocks/fagsak";

const sprintf = require('sprintf-js').sprintf

export const addArbeidsperiode: ActionCreator<ActionWithPayload<ArbeidsperiodeFraAA>> = (
  payload: ArbeidsperiodeFraAA
): ActionWithPayload<ArbeidsperiodeFraAA> => ({
  type: types.SAK_ARBEIDSPERIODER_ADD,
  payload
})

export const addFamilierelasjoner: ActionCreator<ActionWithPayload<OldFamilieRelasjon>> = (
  payload: OldFamilieRelasjon
): ActionWithPayload<OldFamilieRelasjon> => ({
  type: types.SAK_FAMILIERELASJONER_ADD,
  payload
})

export const sakReset: ActionCreator<Action> = (): Action => ({
  type: types.SAK_RESET
})

export const createSak = (data: any): ActionWithPayload<any> => {
  const payload = {
    buctype: data.buctype,
    fnr: data.fnr,
    landKode: data.landKode,
    institusjonsID: data.institusjonsID,
    fagsak: data.fagsak,
    sedtype: data.sedtype,
    sektor: data.sektor,
    tilleggsopplysninger: {
      arbeidsforhold: [],
      familierelasjoner: []
    } as any
  } as any
  if (data.enhet) {
    payload.enhet = data.enhet
  }
  if (data.arbeidsperioder && data.arbeidsperioder.length > 0) {
    payload.tilleggsopplysninger.arbeidsforhold = data.arbeidsperioder
  }
  if (data.familierelasjoner && data.familierelasjoner.length > 0) {
    let relasjoner = data.familierelasjoner.map((relasjon: any) => ({
      ...relasjon,
      fdato: relasjon.fdato.indexOf('-') > 0
        ? relasjon.fdato
        : moment(relasjon.fdato, ['DD.MM.YYYY HH:mm', 'DD.MM.YYYY']).format('YYYY-MM-DD')
    }))

    relasjoner.forEach((r:any) => {
      if(r.statsborgerskap && r.statsborgerskapList){
        delete r.statsborgerskapList
      }
    })

    payload.tilleggsopplysninger.familierelasjoner = relasjoner
  }

  return call({
    url: urls.API_SAK_SEND_URL,
    method: 'POST',
    payload,
    expectedPayload: mockSendSak,
    type: {
      request: types.SAK_SEND_REQUEST,
      success: types.SAK_SEND_SUCCESS,
      failure: types.SAK_SEND_FAILURE
    }
  })
}

export const getFagsaker = (
  fnr: string, sektor: string, tema: string
): ActionWithPayload<Fagsaker> => {
  return call({
    url: sprintf(urls.API_GET_FAGSAKER_URL, { fnr, tema }),
    expectedPayload: mockFagsakerList({ fnr, sektor, tema }),
    type: {
      request: types.SAK_FAGSAKER_REQUEST,
      success: types.SAK_FAGSAKER_SUCCESS,
      failure: types.SAK_FAGSAKER_FAILURE
    }
  })
}

export const createFagsakGenerell = (
  fnr: string, tema: string
): ActionWithPayload<Fagsaker> => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_CREATE_FAGSAK_GENERELL_URL, { fnr }),
    body: {
      tema
    },
    expectedPayload: mockFagsakGenerell,
    type: {
      request: types.SAK_CREATE_FAGSAK_GENERELL_REQUEST,
      success: types.SAK_CREATE_FAGSAK_GENERELL_SUCCESS,
      failure: types.SAK_CREATE_FAGSAK_GENERELL_FAILURE
    }
  })
}

export const createFagsakDagpenger = (
  fnr: string, payload: FagsakPayload
): ActionWithPayload<Fagsaker> => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_PDU1_CREATE_FAGSAK_URL, { fnr }),
    expectedPayload: mockFagsakDagpenger,
    body: payload,
    type: {
      request: types.SAK_CREATE_FAGSAK_DAGPENGER_REQUEST,
      success: types.SAK_CREATE_FAGSAK_DAGPENGER_SUCCESS,
      failure: types.SAK_CREATE_FAGSAK_DAGPENGER_FAILURE
    }
  })
}

export const getInstitusjoner = (
): ActionWithPayload<Institusjoner> => {
  return call({
    url: sprintf(urls.API_ALL_INSTITUSJONER_URL),
    expectedPayload: mockInstitusjon(),
    type: {
      request: types.SAK_INSTITUSJONER_REQUEST,
      success: types.SAK_INSTITUSJONER_SUCCESS,
      failure: types.SAK_INSTITUSJONER_FAILURE
    }
  })
}

export const setInstitusjonerAndLandkoderByBucType: ActionCreator<ActionWithPayload> = (
  buctype: string
): ActionWithPayload => ({
  type: types.SAK_INSTITUSJONER_AND_LANDKODER_BY_BUCTYPE_SET,
  payload: buctype
})

export const setInstitusjonerByLandkode: ActionCreator<ActionWithPayload> = (
   landkode: string
): ActionWithPayload => ({
  type: types.SAK_INSTITUSJONER_BY_LANDKODE_SET,
  payload: landkode
})

export const resetFilloutInfo = () => ({
  type: types.SAK_FILLOUTINFO_RESET
})

export const editSed = (
  opprettSak: OpprettetSak, template: any
): ActionWithPayload<Array<Kodeverk>> => {
  return call({
    url: sprintf(urls.API_SED_EDIT_URL, { rinaSakId: opprettSak.sakId, sedId: opprettSak.sedId }),
    expectedPayload: mockReplySed(template.sed.sedType),
    context: {
      template
    },
    type: {
      request: types.SAK_FILLOUTINFO_REQUEST,
      success: types.SAK_FILLOUTINFO_SUCCESS,
      failure: types.SAK_FILLOUTINFO_FAILURE
    }
  })
}

export const removeArbeidsperiode: ActionCreator<ActionWithPayload<ArbeidsperiodeFraAA>> = (
  payload: ArbeidsperiodeFraAA
): ActionWithPayload<ArbeidsperiodeFraAA> => ({
  type: types.SAK_ARBEIDSPERIODER_REMOVE,
  payload
})

export const removeFamilierelasjoner: ActionCreator<ActionWithPayload<OldFamilieRelasjon>> = (
  payload: OldFamilieRelasjon
): ActionWithPayload<OldFamilieRelasjon> => ({
  type: types.SAK_FAMILIERELASJONER_REMOVE,
  payload
})

export const resetFagsaker: ActionCreator<Action> = (): Action => ({
  type: types.SAK_FAGSAKER_RESET
})

export const resetSentSed: ActionCreator<Action> = (): Action => ({
  type: types.SAK_SEND_RESET
})

export const setProperty: ActionCreator<ActionWithPayload<ParamPayload>> = (
  key: string, value: string | undefined
): ActionWithPayload<ParamPayload> => ({
  type: types.SAK_PROPERTY_SET,
  payload: { key, value }
})
