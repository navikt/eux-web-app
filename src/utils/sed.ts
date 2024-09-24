import { PDU1 } from 'declarations/pd'
import { Barn, F002Sed, FSed, ReplySed } from 'declarations/sed'
import _ from 'lodash'

export const isSed = (replySed: ReplySed | PDU1 | null | undefined): boolean => !!(replySed as ReplySed)?.sedType

export const isFSed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType?.startsWith('F') ?? false

export const isUSed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType?.startsWith('U') ?? false

export const isHSed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType?.startsWith('H') ?? false

export const isXSed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType?.startsWith('X') ?? false

export const isF001Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'F001'

export const isF002Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'F002'

export const isF003Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'F003'

export const isF026Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'F026'

export const isF027Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'F027'

export const canAddPerson = (replySed: ReplySed | PDU1 | null | undefined): boolean => isF001Sed(replySed) || isF002Sed(replySed) || isF003Sed(replySed)

export const isU002Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'U002'

export const isU004Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'U004'

export const isU017Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'U017'

export const isH001Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'H001'

export const isH002Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'H002'

export const isX001Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'X001'

export const isX008Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'X008'

export const isX009Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'X009'

export const isX010Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'X010'

export const isX011Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'X011'

export const isX012Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'X012'

export const isPreviewableSed = (sedType: string): boolean =>
  ['F001', 'F002', 'F003', 'H001', 'H002',  'U002', 'U004', 'U017', 'X001', 'X008', 'X009', 'X010', 'X011', 'X012'].indexOf(sedType) >= 0

export const cleanReplySed = (replySed: ReplySed): ReplySed => {
  const newReplySed = _.cloneDeep(replySed)

  // if we do not have vedtak, do not have ytelse in barna
  if (Object.prototype.hasOwnProperty.call(replySed, 'formaal') && (replySed as FSed)?.formaal.indexOf('vedtak') < 0) {
    (newReplySed as F002Sed).barn?.forEach((b: Barn, i: number) => {
      if (Object.prototype.hasOwnProperty.call((newReplySed as F002Sed).barn?.[i], 'ytelser')) {
        delete (newReplySed as F002Sed).barn?.[i].ytelser
      }
    })
  }
  return newReplySed
}
