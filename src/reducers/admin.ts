import {AnyAction} from "redux";
import * as types from "constants/actionTypes";

export interface AdminState {
  publishingSedEvents: boolean
  publishingSedEventsSuccess: boolean
}

export const initialAdminState: AdminState = {
  publishingSedEvents: false,
  publishingSedEventsSuccess: false,
}

const adminReducer = (state: AdminState = initialAdminState, action: AnyAction) => {

  switch (action.type) {
    case types.ADMIN_RESET_SUCCESS_MSG:
      return {
        ...state,
        publishingSedEventsSuccess: false,
      }

    case types.ADMIN_PUBLISH_SED_EVENTS_REQUEST:
      return {
        ...state,
        publishingSedEvents: true,
        publishingSedEventsSuccess: false,
      }

    case types.ADMIN_PUBLISH_SED_EVENTS_SUCCESS:
      return {
        ...state,
        publishingSedEvents: false,
        publishingSedEventsSuccess: true
      }

    case types.ADMIN_PUBLISH_SED_EVENTS_FAILURE:
      return {
        ...state,
        publishingSedEvents: false,
        publishingSedEventsSuccess: false
      }

    default:
      return state
  }
}

export default adminReducer
