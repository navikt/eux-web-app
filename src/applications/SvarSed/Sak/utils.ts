import {Sak, Sed} from 'declarations/types'

export const hasSentStatus = (svarsedId: string, sedStatus: {[k in string]: string | null}): boolean => {
  if (!Object.prototype.hasOwnProperty.call(sedStatus, svarsedId)) {
    return false
  }
  return sedStatus[svarsedId] === 'sent'
}

export const isSedEditable = (
  sak: Sak,
  connectedSed: Sed,
  sedStatus: {[k in string]: string | null}
) => (
  !!sak.ikkeJournalfoerteSed?.length ||
  !hasSentStatus(connectedSed.svarsedId!, sedStatus) ||
  (connectedSed.sedHandlinger && connectedSed.sedHandlinger?.indexOf('Update') >= 0) ||
  (connectedSed.svarsedType && !sak.ikkeJournalfoerteSed?.length)
)
