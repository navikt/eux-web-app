import * as types from 'constants/actionTypes'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'

export const loadEntries = (key: string): ActionWithPayload => ({
  type: types.LOCALSTORAGE_SAVEDENTRIES_LOAD,
  payload: {
    key: key
  }
})

export const saveEntries = (key: string, value: Array<LocalStorageEntry<ReplySed>>): ActionWithPayload<any> => ({
  type: types.LOCALSTORAGE_SAVEDENTRIES_SAVE,
  payload: {
    key: key,
    value: value
  }
})
