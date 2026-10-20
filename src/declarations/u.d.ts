import { PersonInfo } from 'declarations/sed'

export interface Person {
  personInfo: PersonInfo
}

export interface LokaltSaksnummer {
  landkode?: string
  saksnummer?: string
  institusjonsid?: string
  institusjonsnavn?: string
}
