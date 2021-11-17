import { ReplyPdu1 } from 'declarations/pd'
import { ReplySed } from 'declarations/sed'

export const isSed = (replySed: ReplySed | ReplyPdu1 | null | undefined): boolean => !!(replySed as ReplySed)?.sedType

export const isFSed = (replySed: ReplySed | ReplyPdu1 | null | undefined): boolean => (replySed as ReplySed)?.sedType?.startsWith('F') ?? false

export const isUSed = (replySed: ReplySed | ReplyPdu1 | null | undefined): boolean => (replySed as ReplySed)?.sedType?.startsWith('U') ?? false

export const isHSed = (replySed: ReplySed | ReplyPdu1 | null | undefined): boolean => (replySed as ReplySed)?.sedType?.startsWith('H') ?? false

export const isF002Sed = (replySed: ReplySed | ReplyPdu1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'F002'

export const isU002Sed = (replySed: ReplySed | ReplyPdu1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'U002'

export const isU004Sed = (replySed: ReplySed | ReplyPdu1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'U004'

export const isU017Sed = (replySed: ReplySed | ReplyPdu1 | null | undefined): boolean => (replySed as ReplySed)?.sedType === 'U017'
