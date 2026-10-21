import { Adresse, BaseReplySed, Epost, Telefon } from 'declarations/sed'
import { LokaltSaksnummer, Person } from 'declarations/u'

export interface Bruker extends Person {
  adresse?: Adresse
  telefon?: Array<Telefon>
  epost?: Array<Epost>
}

export interface U009Sed extends BaseReplySed {
  bruker: Bruker
  lokaleSaksnumre?: Array<LokaltSaksnummer>
  registreringsdato?: string
}
