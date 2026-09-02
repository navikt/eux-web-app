import { Person } from 'declarations/h'
import { BaseReplySed, JaNei } from 'declarations/sed'

export interface RegistrertPerson {
  overholdtProsedyrer?: JaNei
  somRapportertIU10?: JaNei
  ytterligereInfo?: string
}

export interface LokaltSaksnummer {
  landkode?: string
  saksnummer?: string
  institusjonsid?: string
  institusjonsnavn?: string
}

export interface U013Sed extends BaseReplySed {
  bruker: Person
  lokaleSaksnumre?: Array<LokaltSaksnummer>
  registrertPerson?: RegistrertPerson
}
