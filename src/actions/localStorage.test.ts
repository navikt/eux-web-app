import * as localStorageActions from 'actions/localStorage'
import * as types from 'constants/actionTypes'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import getReplySed from 'mocks/svarsed/replySed'

describe('actions/localStorage', () => {
  const namespace = 'svarsed'

  it('loadEntries()', () => {
    const mockKey = 'mockKey'
    const generatedResult = localStorageActions.loadEntries(namespace, mockKey)
    expect(generatedResult)
      .toMatchObject({
        type: types.LOCALSTORAGE_ENTRIES_LOAD,
        payload: {
          key: mockKey
        }
      })
  })

  it('setCurrentEntry()', () => {
    const mockEntry = {
      id: 'id',
      name: 'name',
      date: 'date',
      content: getReplySed('H002')
    } as LocalStorageEntry<ReplySed>
    const generatedResult = localStorageActions.setCurrentEntry(namespace, mockEntry)
    expect(generatedResult)
      .toMatchObject({
        type: types.LOCALSTORAGE_CURRENTENTRY_SET,
        payload: mockEntry
      })
  })

  it('removeEntry()', () => {
    const mockKey = 'mockKey'
    const mockEntry = {
      id: 'id',
      name: 'name',
      date: 'date',
      content: getReplySed('H002')!
    }
    const generatedResult = localStorageActions.removeEntry(namespace, mockKey, mockEntry)
    expect(generatedResult)
      .toMatchObject({
        type: types.LOCALSTORAGE_ENTRY_REMOVE,
        payload: {
          key: mockKey,
          entry: mockEntry
        }
      })
  })

  it('saveEntry()', () => {
    const mockKey = 'mockKey'
    const mockEntry = {
      id: 'id',
      name: 'name',
      date: 'date',
      content: getReplySed('H002')!
    }
    const generatedResult = localStorageActions.saveEntry(namespace, mockKey, mockEntry)
    expect(generatedResult)
      .toMatchObject({
        type: types.LOCALSTORAGE_ENTRY_SAVE,
        payload: {
          key: mockKey,
          entry: mockEntry
        }
      })
  })
})
