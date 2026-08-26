import { BaseReplySed } from 'declarations/sed'
import { PersonMedAdresser } from './h'

export type HSvarType = 'positivt' | 'negativt'

export interface Svar {
  informasjon: string
  dokument: string
  sed: string
  grunn?: string
}

export interface H002Sed extends BaseReplySed {
  bruker: PersonMedAdresser
  ytterligereInfo?: string
  vedlagteDokumenttyper: {
    dokumenttyper: Array<string>
    andreDokumenttyper: Array<string>
  }
  positivtSvar?: Svar
  negativtSvar?: Svar
}
