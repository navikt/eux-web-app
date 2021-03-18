import * as types from 'constants/actionTypes'
import { SavingAttachmentsJob, JoarkBrowserItemWithContent, JoarkPoster } from 'declarations/attachments'
import { ActionWithPayload } from 'js-fetch-api'

export interface JoarkState {
  list: Array<JoarkPoster> | undefined
  previewFile: JoarkBrowserItemWithContent | undefined
  savingAttachmentsJob: SavingAttachmentsJob | undefined
}

export const initialJoarkState: JoarkState = {
  list: undefined,
  previewFile: undefined,
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
        previewFile: action.payload
      }

    case types.JOARK_PREVIEW_SUCCESS:
      return {
        ...state,
        previewFile: {
          ...action.context,
          name: action.payload.fileName,
          size: action.payload.filInnhold.length,
          mimetype: action.payload.contentType,
          content: {
            base64: action.payload.filInnhold
          }
        } as JoarkBrowserItemWithContent
      }

    default:
      return state
  }
}

export default joarkReducer
