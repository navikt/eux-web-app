import { Bruker } from 'declarations/h120'
import { BaseReplySed } from 'declarations/sed'
import { LokaltSaksnummer } from 'declarations/u013'

export interface U009Sed extends BaseReplySed {
  bruker: Bruker
  lokaleSaksnumre?: Array<LokaltSaksnummer>
  registreringsdato?: string
}
