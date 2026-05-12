import { XSed } from 'declarations/sed'

export interface SvarGjenaapning {
  erGodkjent?: string
  grunnType?: string
  grunnAnnet?: string
}

export interface X003Sed extends XSed {
  svarGjenaapning?: SvarGjenaapning
}
