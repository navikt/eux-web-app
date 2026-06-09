import { XSed } from 'declarations/sed'

export interface BekreftelseGjenaapning {
  skalGjenaapnes?: string
  grunnType?: string
}

export interface X004Sed extends XSed {
  gjenaapning?: BekreftelseGjenaapning
}
