import { ParamPayload } from 'declarations/app'
import {
  Fagsaker,
  Institusjoner,
  Kodeverk, NavRinasak,
  OpprettetSak,
  PersonInfoPDL
} from 'declarations/types'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockSendSak from 'mocks/sak/sendSak'
import mockFagsakerList from 'mocks/fagsakerList'
import { mockInstitusjon } from 'mocks/institutionList'
import mockReplySed from 'mocks/svarsed/replySed'
import { Action, ActionCreator } from 'redux'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import {FagsakPayload} from "../declarations/pd";
import mockFagsakGenerell from "../mocks/fagsak_generell";
import mockFagsakDagpenger from "../mocks/fagsak";

// @ts-ignore
import { sprintf } from 'sprintf-js'
import mockNavrinasak from "../mocks/app/navrinasak";

export const sakReset: ActionCreator<Action> = (): Action => ({
  type: types.SAK_RESET
})

export const createSak = (payload: any): ActionWithPayload<any> => {
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

export const getFagsakTema = (rinaSakId: String): ActionWithPayload<NavRinasak> => {
  console.log("getFagsakTema")
  return call({
    url: sprintf(urls.API_GET_FAGSAKTEMA_URL, { rinaSakId }),
    expectedPayload: mockNavrinasak,
    type: {
      request: types.SAK_GET_FAGSAKTEMA_REQUEST,
      success: types.SAK_GET_FAGSAKTEMA_SUCCESS,
      failure: types.SAK_GET_FAGSAKTEMA_FAILURE
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
  buctype: string, landkode: string
): ActionWithPayload<Institusjoner> => {
  return call({
    url: sprintf(urls.API_INSTITUSJONER_URL, { buctype, landkode }),
    expectedPayload: mockInstitusjon(),
    type: {
      request: types.SAK_INSTITUSJONER_REQUEST,
      success: types.SAK_INSTITUSJONER_SUCCESS,
      failure: types.SAK_INSTITUSJONER_FAILURE
    }
  })
}

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

export const addFamilierelasjoner: ActionCreator<ActionWithPayload<PersonInfoPDL>> = (
  payload: PersonInfoPDL
): ActionWithPayload<PersonInfoPDL> => ({
  type: types.SAK_FAMILIERELASJONER_ADD,
  payload
})

export const removeFamilierelasjoner: ActionCreator<ActionWithPayload<PersonInfoPDL>> = (
  payload: PersonInfoPDL
): ActionWithPayload<PersonInfoPDL> => ({
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
