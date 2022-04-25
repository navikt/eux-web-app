import * as types from 'constants/actionTypes'
import { PDU1 } from 'declarations/pd'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import { AnyAction } from 'redux'

// these are used for: 1) reducer namespace, and 2) local storage key
export type LocalStorageNamespaces = 'svarsed' | 'pdu1'

export interface LocalStorageState {
  svarsed: {
    entries: Array<LocalStorageEntry<ReplySed>> | null | undefined
    // currentEntry !== undefined serves only the purpose of telling SEDEdit that the
    // current replySed came from a localstorage load, and therefore decides if the saving
    // button will be labeled as Update or Save
    currentEntry: LocalStorageEntry<ReplySed> | undefined
  }
  pdu1: {
    entries: Array<LocalStorageEntry<PDU1>> | null | undefined
    currentEntry: LocalStorageEntry<PDU1> | undefined
  }
}

export const initialLocalStorageState: LocalStorageState = {
  svarsed: {
    entries: undefined,
    currentEntry: undefined
  },
  pdu1: {
    entries: undefined,
    currentEntry: undefined
  }
}

const localStorageReducer = (
  state: LocalStorageState = initialLocalStorageState,
  action: AnyAction
): LocalStorageState => {
  const namespace: LocalStorageNamespaces | undefined = (action as ActionWithPayload).payload?.namespace

  if (namespace) {
    switch (action.type) {
      case types.LOCALSTORAGE_ENTRIES_LOAD: {
        const items: string | null = window.localStorage.getItem((action as ActionWithPayload).payload.namespace)
        let entries: Array<LocalStorageEntry<ReplySed | PDU1>> | null | undefined
        if (_.isString(items)) {
          entries = JSON.parse(items)
        } else {
          entries = null
        }
        return {
          ...state,
          [namespace]: {
            currentEntry: state[namespace].currentEntry,
            entries
          }
        }
      }

      case types.LOCALSTORAGE_ENTRY_REMOVE: {
        const newEntries: Array<LocalStorageEntry<ReplySed | PDU1>> | null | undefined = _.cloneDeep(state[namespace].entries)
        const index: number = _.findIndex(newEntries, (entry) =>
          entry.id === ((action as ActionWithPayload).payload).entry.id
        )
        if (index >= 0) {
          if (!_.isNil(newEntries)) {
            newEntries.splice(index, 1)
            window.localStorage.setItem(
              (action as ActionWithPayload).payload.namespace,
              JSON.stringify(newEntries, null, 2))
          }
        }
        return {
          ...state,
          [namespace]: {
            ...state[namespace],
            entries: newEntries
          }
        }
      }

      case types.LOCALSTORAGE_ALL_REMOVE : {
        window.localStorage.setItem((action as ActionWithPayload).payload.namespace, '[]')
        return {
          ...state,
          [namespace]: {
            entries: undefined,
            currentEntry: undefined
          }
        }
      }

      case types.LOCALSTORAGE_ENTRY_SAVE: {
        let newEntries: Array<LocalStorageEntry<ReplySed | PDU1>> | null | undefined = _.cloneDeep(state[namespace].entries)
        const newEntry: LocalStorageEntry<ReplySed | PDU1> = (action as ActionWithPayload).payload.entry

        if (_.isNil(newEntries)) {
          newEntries = []
        }

        const existsIndex: number = _.findIndex(newEntries, _e => _e.id === newEntry.id)
        if (existsIndex >= 0) {
          newEntries[existsIndex] = (action as ActionWithPayload).payload.entry
        } else {
          newEntries = newEntries.concat(newEntry)
        }

        window.localStorage.setItem(
          (action as ActionWithPayload).payload.namespace,
          JSON.stringify(newEntries, null, 2))

        return {
          ...state,
          [namespace]: {
            ...(state[namespace]),
            entries: newEntries
          }
        }
      }

      case types.LOCALSTORAGE_CURRENTENTRY_SET: {
        return {
          ...state,
          [namespace]: {
            ...(state[namespace]),
            currentEntry: (action as ActionWithPayload).payload.entry
          }
        }
      }

      case types.LOCALSTORAGE_CURRENTENTRY_RESET: {
        return {
          ...state,
          [namespace]: {
            ...(state[namespace]),
            currentEntry: undefined
          }
        }
      }

      default:
        return state
    }
  }
  return state
}

export default localStorageReducer
