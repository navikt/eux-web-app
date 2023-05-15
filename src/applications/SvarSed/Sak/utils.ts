import { ReplySed } from 'declarations/sed'
import {LocalStorageEntry, Sak, Sed} from 'declarations/types'
import _ from 'lodash'

export const hasSentStatus = (svarsedId: string, sedStatus: {[k in string]: string | null}): boolean => {
  if (!Object.prototype.hasOwnProperty.call(sedStatus, svarsedId)) {
    return false
  }
  return sedStatus[svarsedId] === 'sent'
}

export const findSavedEntry = (
  id: string,
  entries: Array<LocalStorageEntry<ReplySed>> | null | undefined
): LocalStorageEntry<ReplySed> | undefined => (
  _.find(entries, (e: LocalStorageEntry<ReplySed>) => e.id === id)
)

export const hasDraftFor = (
  sed: Sed,
  entries: Array<LocalStorageEntry<ReplySed>> | null | undefined,
  needle: string
): boolean => (
  findSavedEntry(_.get(sed, needle), entries) !== undefined)

export const isSedEditable = (
  sak: Sak,
  connectedSed: Sed,
  entries: Array<LocalStorageEntry<ReplySed>> | null | undefined,
  sedStatus: {[k in string]: string | null}
) => (
  !!sak.ikkeJournalfoerteSed?.length ||
  (hasDraftFor(connectedSed, entries, 'svarsedId') && !hasSentStatus(connectedSed.svarsedId!, sedStatus)) ||
  (connectedSed.sedHandlinger?.indexOf('Update') >= 0) ||
  (connectedSed.svarsedType && !sak.ikkeJournalfoerteSed?.length)
)
