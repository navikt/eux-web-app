import { Adresse, HSed } from 'declarations/sed'

// ===== Forhåndsdefinerte dokumenter (Section 4) =====
// Verdikodene mappes videre av eux-rina-api til H070-dokumentkoder:
// søknad → «(01) Dødsattest», dødsattest → «(02) Medisinsk informasjon», annet → «(99) Annet»
export type ForhaandsdefinertDokumentType =
  | 'søknad'
  | 'dødsattest'
  | 'annet'

// ===== Melding om dødsfall (Section 2) + Vedlagt dokumentasjon av dødsfall (Section 4) =====

export interface Doedsfall {
  doedsdato?: string
  doedssted?: Adresse
  forhaandsdefinerteDokumenter?: Array<ForhaandsdefinertDokumentType>
  annetDokument?: string
}

// ===== H070 SED =====
// bruker (PersonTypeH) og ytterligereInfo arves fra HSed.

export interface H070Sed extends HSed {
  doedsfall?: Doedsfall
}
