import * as types from 'constants/actionTypes'
import {
  SavingAttachmentsJob,
  JoarkPoster,
  JoarkBrowserItem
} from 'declarations/attachments'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'

export interface JoarkState {
  list: Array<JoarkPoster> | undefined
  previewFileRaw: Blob | null | undefined
  savingAttachmentsJob: SavingAttachmentsJob | undefined
}

export const initialJoarkState: JoarkState = {
  list: undefined,
  previewFileRaw: undefined,
  savingAttachmentsJob: undefined
}

const joarkReducer = (state: JoarkState = initialJoarkState, action: ActionWithPayload = { type: '', payload: '' }) => {
  switch (action.type) {
    case types.JOARK_LIST_SUCCESS:
      return {
        ...state,
        list: action.payload.data.dokumentoversiktBruker.journalposter
      }

    case types.JOARK_PREVIEW_SET:
      return {
        ...state,
        previewFileRaw: action.payload
      }

    case types.JOARK_PREVIEW_REQUEST:
      return {
        ...state,
        previewFileRaw: undefined
      }

    case types.JOARK_PREVIEW_FAILURE:
      return {
        ...state,
        previewFileRaw: null
      }

      case types.JOARK_PREVIEW_SUCCESS:
      return {
        ...state,
        previewFileRaw: action.payload
      }

    case types.ATTACHMENT_SEND_SUCCESS: {
      const newlySavedJoarkBrowserItem: JoarkBrowserItem = (action as ActionWithPayload).context.joarkBrowserItem
      const newRemaining = _.reject(state.savingAttachmentsJob!.remaining, (item: JoarkBrowserItem) => {
        return item.dokumentInfoId === newlySavedJoarkBrowserItem.dokumentInfoId &&
          item.journalpostId === newlySavedJoarkBrowserItem.journalpostId &&
          item.variant === newlySavedJoarkBrowserItem.variant
      })
      newlySavedJoarkBrowserItem.type = 'sednew'
      const newSaved = state.savingAttachmentsJob?.saved.concat(newlySavedJoarkBrowserItem)

      return {
        ...state,
        savingAttachmentsJob: {
          ...state.savingAttachmentsJob,
          saving: undefined,
          saved: newSaved,
          remaining: newRemaining
        }
      }
    }

    case types.ATTACHMENT_SAVINGATTACHMENTJOB_SET:

      return {
        ...state,
        savingAttachmentsJob: {
          total: (action as ActionWithPayload).payload,
          remaining: (action as ActionWithPayload).payload,
          saving: undefined,
          saved: []
        }
      }

    case types.ATTACHMENT_SEND_REQUEST:
      return {
        ...state,
        attachmentsError: false,
        savingAttachmentsJob: {
          ...state.savingAttachmentsJob,
          saving: {
            foo: 'bar'
          }
        }
      }

    case types.ATTACHMENT_RESET: {
      return {
        ...state,
        savingAttachmentsJob: undefined
      }
    }

    default:
      return state
  }
}

export default joarkReducer
