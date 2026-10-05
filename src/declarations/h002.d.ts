import { BaseReplySed } from 'declarations/sed'
import {
  BasePersonInfo,
  PersonMedAdresser,
  PersonensStatus,
  Vedlegg
} from './h'

export interface NegativtSvar {
  informasjon?: string
  dokument?: string
  sed?: string
  grunn?: string
}

export interface PositivtSvar {
  informasjon?: string
  dokument?: string
  sed?: string
}

export interface SektorPin {
  alle?: string
  sykepengerKontant?: string
  sykepengerGodtgjoerelse?: string
  pensjon?: string
  arbeidsledighet?: string
  yrkessykdomKontant?: string
  yrkessykdomGodtgjoerelse?: string
  familieytelser?: string
  tilbakebetaling?: string
  annenSektorPin?: string
  annenSektorBeskrivelse?: string
}

export interface IdentifiseringPersonInfo extends BasePersonInfo {
  sektorPin?: SektorPin
  nasjonaltSkatteNummer?: string
}

export interface Identifisering {
  personInfo?: IdentifiseringPersonInfo
}

export interface Bruker extends PersonMedAdresser {
  personensstatus?: Array<PersonensStatus>
  personensstatusAnnet?: string
  identifisering?: Identifisering
  positivtSvar?: PositivtSvar
  negativtSvar?: Array<NegativtSvar>
  ytterligereInfo?: string
  vedlegg?: Vedlegg
}

export interface H002Sed extends BaseReplySed {
  bruker: Bruker
}
