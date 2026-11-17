import { BaseReplySed, JaNei, Periode } from 'declarations/sed'
import { LokaltSaksnummer, OmstendighetType, Person } from 'declarations/u'

export interface Omstendigheter {
  periode?: Periode
  typer?: Array<OmstendighetType>
  andreOmstendigheter?: Array<string>
}

export interface U010Sed extends BaseReplySed {
  bruker: Person
  lokaleSaksnumre?: Array<LokaltSaksnummer>
  omstendigheter?: Omstendigheter
  oenskerOppfoelging?: JaNei
}
