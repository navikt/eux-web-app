import { BaseReplySed } from 'declarations/sed'
import { Bruker, LokaltSaksnummer } from 'declarations/u'

export interface U009Sed extends BaseReplySed {
  bruker: Bruker
  lokaleSaksnumre?: Array<LokaltSaksnummer>
  registreringsdato?: string
}
