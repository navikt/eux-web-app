import { BaseReplySed, JaNei, Periode } from 'declarations/sed'
import { LokaltSaksnummer, HendelseType, Person } from 'declarations/u'

export interface Hendelser {
  periode?: Periode
  typer?: Array<HendelseType>
  andreHendelser?: Array<string>
}

export interface U010Sed extends BaseReplySed {
  bruker: Person
  lokaleSaksnumre?: Array<LokaltSaksnummer>
  hendelser?: Hendelser
  oenskerOppfoelging?: JaNei
}
