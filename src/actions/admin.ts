import {Action} from "redux";
import {call} from "@navikt/fetch";
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
// @ts-ignore
import { sprintf } from 'sprintf-js';

export const publishSedEvents = (
  sedEvents: Array<{rinasakId: string, documentId: string, documentVersion: string}>
): Action => {
  console.log(sedEvents)
  return call({
    url: sprintf(urls.ADMIN_PUBLISH_SED_EVENTS_URL),
    cascadeFailureError: true,
    expectedPayload: { success: true },
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

export const adminResetSuccessMsg = () => ({
  type: types.ADMIN_RESET_SUCCESS_MSG,
})

