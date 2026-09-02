import { Person } from 'declarations/h'
import { BaseReplySed, JaNei, LokaleSakId } from 'declarations/sed'

export interface RegistrertPerson {
  overholdtProsedyrer?: JaNei
  somRapportertIU10?: JaNei
  ytterligereInfo?: string
}

export interface U013Sed extends BaseReplySed {
  bruker: Person
  lokaleSaksnumre?: Array<LokaleSakId>
  registrertPerson?: RegistrertPerson
}
