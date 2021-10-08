import { ReplySed } from 'declarations/sed'

export const isSed = (replySed: ReplySed | null | undefined): boolean => !!replySed?.sedType

export const isFSed = (replySed: ReplySed | null | undefined): boolean => replySed?.sedType.startsWith('F') ?? false

export const isUSed = (replySed: ReplySed | null | undefined): boolean => replySed?.sedType.startsWith('U') ?? false

export const isHSed = (replySed: ReplySed | null | undefined): boolean => replySed?.sedType.startsWith('H') ?? false

export const isF002Sed = (replySed: ReplySed | null | undefined): boolean => replySed?.sedType === 'F002'

export const isU002Sed = (replySed: ReplySed | null | undefined): boolean => replySed?.sedType === 'U002'

export const isU004Sed = (replySed: ReplySed | null | undefined): boolean => replySed?.sedType === 'U004'

export const isU017Sed = (replySed: ReplySed | null | undefined): boolean => replySed?.sedType === 'U017'
