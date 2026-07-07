import { Adresse, BaseReplySed, PersonInfo } from 'declarations/sed'

// ===== Forhåndsdefinerte dokumenter (Section 4) =====
export type ForhaandsdefinertDokumentType =
  | 'dødsattest'
  | 'medisinsk_informasjon'
  | 'annet'

// ===== Vedlagt dokumentasjon (Section 4) =====

export interface VedlagtDokumentasjon {
  forhaandsdefinerteDokumenter?: Array<ForhaandsdefinertDokumentType>
  annetDokument?: Array<string>
}

// ===== H070 Bruker =====

export interface Bruker {
  personInfo: PersonInfo
}

// ===== H070 SED =====

export interface H070Sed extends BaseReplySed {
  bruker: Bruker
  ytterligereInfo?: string
  doedsdato?: string
  doedssted?: Adresse
  vedlagtDokumentasjon?: VedlagtDokumentasjon
}
