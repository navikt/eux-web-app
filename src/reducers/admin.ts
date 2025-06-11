import {AnyAction} from "redux";
import * as types from "constants/actionTypes";
import {ActionWithPayload} from "@navikt/fetch";

export interface AdminState {
  publishingSedEvents: boolean
  publishingSedEventsStatus: any
}

export const initialAdminState: AdminState = {
  publishingSedEvents: false,
  publishingSedEventsStatus: undefined,
}

const adminReducer = (state: AdminState = initialAdminState, action: AnyAction) => {

  switch (action.type) {
    case types.ADMIN_RESET_STATUS:
      return {
        ...state,
        publishingSedEventsStatus: false,
      }

    case types.ADMIN_PUBLISH_SED_EVENTS_REQUEST:
      return {
        ...state,
        publishingSedEvents: true,
        publishingSedEventsStatus: undefined,
      }

    case types.ADMIN_PUBLISH_SED_EVENTS_SUCCESS:
      const status = (action as ActionWithPayload).status
      return {
        ...state,
        publishingSedEvents: false,
        publishingSedEventsStatus: {
          status: status === 200 ? "SUCCESS" : "PARTIAL SUCCESS",
          message: (action as ActionWithPayload).payload.userMessage,
          successCount: (action as ActionWithPayload).payload.successCount,
          failureCount: (action as ActionWithPayload).payload.failureCount,
        }
      }

    case types.ADMIN_PUBLISH_SED_EVENTS_FAILURE:
      return {
        ...state,
        publishingSedEvents: false,
        publishingSedEventsStatus: {
          status: "FAILURE",
          message: (action as ActionWithPayload).payload.userMessage
        }
      }

    default:
      return state
  }
}

export default adminReducer
