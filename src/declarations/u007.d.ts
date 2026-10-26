import { Adresse, BaseReplySed } from 'declarations/sed'
import { Bruker, LokaltSaksnummer } from 'declarations/u'

export interface Institusjon {
  id?: string
  navn?: string
}

export interface UkjentInstitusjon {
  navn?: string
  adresse?: Adresse
}

export interface InstitusjonDagpenger {
  institusjon?: Institusjon
  ukjentInstitusjon?: UkjentInstitusjon
}

export interface U007Sed extends BaseReplySed {
  bruker: Bruker
  lokaleSaksnumre?: Array<LokaltSaksnummer>
  registreringsdato?: string
  sisteAdresseIKompetentLand?: Adresse
  institusjonDagpenger?: InstitusjonDagpenger
}
