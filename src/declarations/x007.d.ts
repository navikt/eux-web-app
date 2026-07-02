import { XSed } from 'declarations/sed'

export interface Videresend {
  leggTilInstitusjonId?: string
  leggTilInstitusjonNavn?: string
  fjernInstitusjonId?: string
  fjernInstitusjonNavn?: string
  grunnType?: string
  grunnAnnet?: string
}

export interface X007Sed extends XSed {
  videresend?: Videresend
}
