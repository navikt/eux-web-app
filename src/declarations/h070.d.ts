import { Adresse, HSed } from 'declarations/sed'

// ===== Forhåndsdefinerte dokumenter (Section 4) =====
export type ForhaandsdefinertDokumentType =
  | 'dødsattest'
  | 'medisinsk_informasjon'
  | 'annet'

// ===== Melding om dødsfall (Section 2) + Vedlagt dokumentasjon av dødsfall (Section 4) =====

export interface Doedsfall {
  doedsdato?: string
  doedssted?: Adresse
  forhaandsdefinerteDokumenter?: Array<ForhaandsdefinertDokumentType>
  annetDokument?: Array<string>
}

// ===== H070 SED =====
// bruker (PersonTypeH) og ytterligereInfo arves fra HSed.

export interface H070Sed extends HSed {
  doedsfall?: Doedsfall
}
