import * as types from 'constants/actionTypes'
import {
  SavingAttachmentsJob,
  JoarkPoster,
  JoarkBrowserItem, JoarkBrowserItems
} from 'declarations/attachments'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import { AnyAction } from 'redux'

export interface JoarkState {
  list: Array<JoarkPoster> | undefined
  previewFileRaw: Blob | null | undefined
  previewAttachmentFileRaw: Blob | null | undefined
  savingAttachmentsJob: SavingAttachmentsJob | undefined
}

export const initialJoarkState: JoarkState = {
  list: undefined,
  previewFileRaw: undefined,
  previewAttachmentFileRaw: undefined,
  savingAttachmentsJob: undefined
}

const joarkReducer = (state: JoarkState = initialJoarkState, action: AnyAction): JoarkState => {
  switch (action.type) {
    case types.APP_RESET:
      return initialJoarkState

    case types.ATTACHMENT_LIST_SUCCESS:
      return {
        ...state,
        list: action.payload.data.dokumentoversiktBruker.journalposter
      }

    case types.ATTACHMENT_PREVIEW_SET:
      return {
        ...state,
        previewFileRaw: action.payload
      }

    case types.ATTACHMENT_PREVIEW_REQUEST:
      return {
        ...state,
        previewFileRaw: undefined
      }

    case types.ATTACHMENT_PREVIEW_FAILURE:
      return {
        ...state,
        previewFileRaw: null
      }

    case types.ATTACHMENT_PREVIEW_SUCCESS:
      return {
        ...state,
        previewFileRaw: action.payload
      }

    case types.ATTACHMENT_FROM_RINA_PREVIEW_SET:
      return {
        ...state,
        previewAttachmentFileRaw: action.payload
      }

    case types.ATTACHMENT_FROM_RINA_PREVIEW_REQUEST:
      return {
        ...state,
        previewAttachmentFileRaw: undefined
      }

    case types.ATTACHMENT_FROM_RINA_PREVIEW_FAILURE:
      return {
        ...state,
        previewAttachmentFileRaw: null
      }

    case types.ATTACHMENT_FROM_RINA_PREVIEW_SUCCESS:
      return {
        ...state,
        previewAttachmentFileRaw: action.payload
      }



    case types.ATTACHMENT_SEND_REQUEST:
      return {
        ...state,
        savingAttachmentsJob: {
          ...(state.savingAttachmentsJob as SavingAttachmentsJob),
          saving: action.context.joarkBrowserItem
        }
      }

    case types.ATTACHMENT_SEND_SUCCESS: {
      const newlySavedJoarkBrowserItem: JoarkBrowserItem = (action as ActionWithPayload).context.joarkBrowserItem
      const newRemaining = _.reject(state.savingAttachmentsJob!.remaining, (item: JoarkBrowserItem) => {
        return item.dokumentInfoId === newlySavedJoarkBrowserItem.dokumentInfoId &&
          item.journalpostId === newlySavedJoarkBrowserItem.journalpostId &&
          item.variant === newlySavedJoarkBrowserItem.variant
      })
      newlySavedJoarkBrowserItem.type = 'sednew'

      const newSaved: JoarkBrowserItems = state.savingAttachmentsJob!.saved.concat(newlySavedJoarkBrowserItem)

      return {
        ...state,
        savingAttachmentsJob: {
          total: state.savingAttachmentsJob!.total,
          saving: undefined,
          saved: newSaved,
          remaining: newRemaining
        }
      }
    }

    case types.ATTACHMENT_SEND_FAILURE: {
      return {
        ...state,
        savingAttachmentsJob: undefined
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
