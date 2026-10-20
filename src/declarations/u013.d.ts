import { BaseReplySed, JaNei } from 'declarations/sed'
import { LokaltSaksnummer, Person } from 'declarations/u'

export interface RegistrertPerson {
  overholdtProsedyrer?: JaNei
  rapportertIU010?: JaNei
  ytterligereInfo?: string
}

export interface U013Sed extends BaseReplySed {
  bruker: Person
  lokaleSaksnumre?: Array<LokaltSaksnummer>
  registrertPerson?: RegistrertPerson
}
