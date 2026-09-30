import { BaseReplySed, PinMangler } from 'declarations/sed'
import {
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

export interface Identifisering {
  personInfo?: {
    etternavn?: string
    fornavn?: string
    foedselsdato?: string
    kjoenn?: 'M' | 'K' | 'U'
    pinMangler?: PinMangler
    tidligereEtternavn?: string
    tidligereFornavn?: string
    sektorPin?: {
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
    nasjonaltSkatteNummer?: string
  }
}

export interface Bruker extends PersonMedAdresser {
  aktivitetsstatus?: Array<PersonensStatus>
  aktivitetsstatusAnnet?: string
  identifisering?: Identifisering
  positivtSvar?: PositivtSvar
  negativtSvar?: Array<NegativtSvar>
  ytterligereInfo?: string
  vedlegg?: Vedlegg
}

export interface H002Sed extends BaseReplySed {
  bruker: Bruker
}
