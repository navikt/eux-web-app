import { BaseReplySed, JaNei } from 'declarations/sed'
import { LokaltSaksnummer, HendelseType, Person } from 'declarations/u'

export interface Eksportperiode {
  sisteMuligeSluttdato?: string
  estimertSluttdato?: string
}

export interface Hendelser {
  typer?: Array<HendelseType>
  andreHendelser?: Array<string>
}

// ===== U008 SED — Eksportdokument (U_BUC_02), svar på U007 =====

export interface U008Sed extends BaseReplySed {
  bruker: Person
  svarPaaSedId?: string
  lokaleSaksnumre?: Array<LokaltSaksnummer>
  erInnvilgetEksport?: JaNei
  eksportperiode?: Eksportperiode
  hendelser?: Hendelser
}
