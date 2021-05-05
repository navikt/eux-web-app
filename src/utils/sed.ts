import { ReplySed } from 'declarations/sed'

export const isFSed = (replySed: ReplySed) => replySed.sedType.startsWith('F')

export const isUSed = (replySed: ReplySed) => replySed.sedType.startsWith('U')

export const isU002Sed = (replySed: ReplySed) => replySed.sedType === 'U002'

export const isU004Sed = (replySed: ReplySed) => replySed.sedType === 'U004'

export const isU017Sed = (replySed: ReplySed) => replySed.sedType === 'U017'
