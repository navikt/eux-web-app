import { PDU1 } from 'declarations/pd'
import { ReplySed } from 'declarations/sed'

export const isSed = (replySed: ReplySed | PDU1 | null | undefined): boolean => !!(replySed as ReplySed)?.sedType

export const isFSed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType?.startsWith('F') ?? false

export const isUSed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType?.startsWith('U') ?? false

export const isHSed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType?.startsWith('H') ?? false

export const isF002Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'F002'

export const isU002Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'U002'

export const isU004Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'U004'

export const isU017Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'U017'

export const isH001Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'H001'

export const isH002Sed = (replySed: ReplySed | PDU1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'H002'
