import { ReplySed } from 'declarations/sed'

export const isFamilieytelser = (replySed: ReplySed) => replySed.sedType.startsWith('F')

export const isDagpenger = (replySed: ReplySed) => replySed.sedType.startsWith('U')
