import {ActionWithPayload, call} from "@navikt/fetch";
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
// @ts-ignore
import { sprintf } from 'sprintf-js';

export const publishSedEvents = (
  sedEvents: Array<{rinasakId: string, documentId: string, documentVersion: string}>
): ActionWithPayload<any> => {
  return call({
    url: sprintf(urls.ADMIN_PUBLISH_SED_EVENTS_URL),
    cascadeFailureError: true,
    expectedPayload: {
      "userMessage": "Følgende SED ble ikke publisert: 1751447_27b266cefb294c81aced7d0100a56cab_1",
      "detail": "Sjekk detaljer for hver hendelse for feilårsaker",
      "successCount": 1,
      "failureCount": 1
    },
    expectedErrorRate: {
      200 : 0.3, 207: 0.3, 500: 0.4
    },
    method: 'POST',
    body: {
      sedEvents
    },
    type: {
      request: types.ADMIN_PUBLISH_SED_EVENTS_REQUEST,
      success: types.ADMIN_PUBLISH_SED_EVENTS_SUCCESS,
      failure: types.ADMIN_PUBLISH_SED_EVENTS_FAILURE
    }
  })
}

export const adminResetStatus = () => ({
  type: types.ADMIN_RESET_STATUS,
})

