import { ReplySed } from 'declarations/sed'

export const isSed = (replySed: ReplySed): boolean => !!replySed?.sedType

export const isFSed = (replySed: ReplySed): boolean => replySed?.sedType.startsWith('F')

export const isUSed = (replySed: ReplySed): boolean => replySed?.sedType.startsWith('U')

export const isHSed = (replySed: ReplySed): boolean => replySed?.sedType.startsWith('H')

export const isU002Sed = (replySed: ReplySed): boolean => replySed?.sedType === 'U002'

export const isU004Sed = (replySed: ReplySed): boolean => replySed?.sedType === 'U004'

export const isU017Sed = (replySed: ReplySed): boolean => replySed?.sedType === 'U017'
