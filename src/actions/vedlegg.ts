import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { VedleggPayload } from 'declarations/types'
import { call, ActionWithPayload } from '@navikt/fetch'
import mockSendVedlegg from 'mocks/vedlegg/sendVedlegg'
import mockRinaDokumenter from 'mocks/vedlegg/rinaDokumenter'
import {JoarkBrowserItems} from "../declarations/attachments";
import {Action, ActionCreator} from "redux";
const sprintf = require('sprintf-js').sprintf

export const resetVedlegg: ActionCreator<Action> = (): Action => ({
  type: types.VEDLEGG_RESET
})

export const getDokument = (rinasaksnummer: string): ActionWithPayload => {
  return call({
    url: sprintf(urls.API_VEDLEGG_DOKUMENT_URL, { rinasaksnummer }),
    expectedPayload: mockRinaDokumenter,
    type: {
      request: types.VEDLEGG_DOKUMENT_REQUEST,
      success: types.VEDLEGG_DOKUMENT_SUCCESS,
      failure: types.VEDLEGG_DOKUMENT_FAILURE
    }
  })
}

export const propertySet = (key: string, value: string | boolean | undefined | JoarkBrowserItems) => ({
  type: types.VEDLEGG_PROPERTY_SET,
  payload: {
    key,
    value
  }
})

export const sendVedlegg = (payload: VedleggPayload): ActionWithPayload => {
  return call({
    url: urls.API_VEDLEGG_POST_URL,
    method: 'POST',
    payload,
    expectedPayload: mockSendVedlegg,
    type: {
      request: types.VEDLEGG_POST_REQUEST,
      success: types.VEDLEGG_POST_SUCCESS,
      failure: types.VEDLEGG_POST_FAILURE
    }
  })
}
