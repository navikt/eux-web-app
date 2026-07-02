import { XSed } from 'declarations/sed'

export type LeggTilInstitusjonGrunnType =
  | 'personen_arbeider_eller_har_arbeidet_i_dette_landet'
  | 'en_annen_institusjon_er_kompetent_institusjon_i_saken'
  | 'annet'

export interface LeggTilInstitusjon {
  institusjonId?: string
  institusjonNavn?: string
  grunnType?: string
  grunnAnnet?: string
  __landkode?: string
}

export interface X005Sed extends XSed {
  leggTilInstitusjon?: LeggTilInstitusjon
}
