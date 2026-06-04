import { XSed } from 'declarations/sed'

export type FjernInstitusjonGrunnType =
  | 'personen_arbeider_ikke_eller_har_ikke_arbeidet_i_dette_landet'
  | 'en_annen_institusjon_er_ikke_kompetent_til_å_behandle_denne_saken'
  | 'annet'

export interface FjernInstitusjon {
  institusjonId?: string
  institusjonNavn?: string
  grunnType?: string
  grunnAnnet?: string
}

export interface X006Sed extends XSed {
  fjernInstitusjon?: FjernInstitusjon
}
