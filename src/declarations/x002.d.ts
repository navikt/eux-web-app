import { XSed } from 'declarations/sed'

export interface Gjenaapning {
  aarsakType?: string
  aarsakAnnet?: string
}

export interface X002Sed extends XSed {
  gjenaapning?: Gjenaapning
}
