import { Adresse, Epost, PersonInfo, Telefon } from 'declarations/sed'

export interface Person {
  personInfo: PersonInfo
}

export interface Bruker extends Person {
  adresse?: Adresse
  telefon?: Array<Telefon>
  epost?: Array<Epost>
}

export interface LokaltSaksnummer {
  landkode?: string
  saksnummer?: string
  institusjonsid?: string
  institusjonsnavn?: string
}
