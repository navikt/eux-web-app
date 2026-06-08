import { XSed } from 'declarations/sed'

export type VideresendGrunnType =
  | 'institusjonen_er_ikke_kompetent_institusjon_i_saken'
  | 'institusjonen_er_ikke_lenger_kompetent_institusjon_i_saken'
  | 'annet'

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
