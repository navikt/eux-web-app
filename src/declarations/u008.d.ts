import { BaseReplySed, JaNei } from 'declarations/sed'
import { LokaltSaksnummer, OmstendighetType, Person } from 'declarations/u'

export interface Eksportperiode {
  maksSluttdato?: string
  estimertSluttdato?: string
}

export interface Omstendigheter {
  typer?: Array<OmstendighetType>
  andreOmstendigheter?: Array<string>
}

// ===== U008 SED — Eksportdokument (U_BUC_02), svar på U007 =====

export interface U008Sed extends BaseReplySed {
  bruker: Person
  svarPaaSedId?: string
  lokaleSaksnumre?: Array<LokaltSaksnummer>
  vedtakOmEksport?: JaNei
  eksportperiode?: Eksportperiode
  omstendigheter?: Omstendigheter
}
